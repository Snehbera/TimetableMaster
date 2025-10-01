import json
import random
import time
from collections import defaultdict
from typing import Dict, List, Optional, TypedDict, Set, Tuple
from itertools import product

# --- Type Definitions ---
LabInfo = TypedDict('LabInfo', {'partition': str, 'lab': str, 'faculty': str})
ConcurrentLabInfo = List[LabInfo]
ClassInfo = TypedDict('ClassInfo', {'type': str, 'division': str, 'subject': Optional[str]})


class TimetableSolver:
    """
    A configurable CSP solver for university timetables.
    """
    def __init__(self, config: Dict):
        self.config = config
        self.working_days = config['settings']['working_days']
        self.slots = config['settings']['periods_per_day']
        self.subjects = config['subjects']
        self.divisions = list(config['divisions'].keys())
        self.off_days = {div: data['off_day'] for div, data in config['divisions'].items()}
        self.partitions = {div: data['partitions'] for div, data in config['divisions'].items()}
        self.faculty_assignments = config['faculty_assignments']

        self.slots_per_day = len(self.slots)
        self.breaks = {int(p) - 1: d for p, d in config['settings'].get('breaks_after_period', {}).items()}
        self.lab_invalid_start_slots = {int(p) - 1 for p in config['settings'].get('breaks_after_period', {})}

        self.timetable: Dict[str, Dict[str, List[Optional[Dict]]]] = {
            div: {day: [None] * self.slots_per_day for day in self.working_days}
            for div in self.divisions
        }

        # Initialize the pool of unassigned labs correctly
        self.unassigned_labs: Dict[str, Set[str]] = defaultdict(set)
        for div, div_partitions in self.partitions.items():
            lab_subjects_for_div = {
                sub for sub, details in self.subjects.items()
                if details.get('labs', 0) > 0 and self._get_faculty(div, sub)
            }
            for partition in div_partitions:
                self.unassigned_labs[partition] = lab_subjects_for_div.copy()

        self.all_required_classes = self._create_required_classes_list()
        self.possible_lecture_slots, self.possible_lab_slots = self._precompute_possible_slots()
        
        self.start_time: float = 0.0
        self.timeout: int = 0
        self.timed_out: bool = False

    def _get_faculty(self, division: str, subject_code: str) -> Optional[str]:
        return self.faculty_assignments.get(subject_code, {}).get(division)

    def _create_required_classes_list(self) -> List[ClassInfo]:
        """Builds a correct list of unique classes to schedule."""
        required = []
        for div in self.divisions:
            # Add lab blocks based on the number of labs FOR THAT DIVISION
            num_lab_sessions_for_div = sum(
                1 for sub, details in self.subjects.items()
                if details.get('labs', 0) > 0 and self._get_faculty(div, sub)
            )
            for _ in range(num_lab_sessions_for_div):
                required.append({'type': 'ConcurrentLabBlock', 'division': div, 'subject': None})
            
            # Add lectures and other multi-period classes
            for sub, details in self.subjects.items():
                if not self._get_faculty(div, sub):
                    continue 
                
                # Use 'double_periods' for combined/double lectures
                for _ in range(details.get('double_periods', 0)):
                    required.append({'type': 'DoubleLec', 'division': div, 'subject': sub})

                for _ in range(details.get('lectures', 0)):
                    required.append({'type': 'Lec', 'division': div, 'subject': sub})

        blocks = [c for c in required if c['type'] != 'Lec']
        lectures = [c for c in required if c['type'] == 'Lec']
        random.shuffle(blocks)
        random.shuffle(lectures)
        return blocks + lectures

    def _precompute_possible_slots(self) -> Tuple[Dict[str, list], Dict[str, list]]:
        # This function is well-structured and doesn't need changes.
        lecture_slots, lab_slots = {}, {}
        middle_slot_indices = list(range(1, self.slots_per_day - 1))

        for div in self.divisions:
            lec_middle, lec_edge, lab_middle, lab_edge = [], [], [], []
            for day in self.working_days:
                if day == self.off_days.get(div):
                    continue

                for slot in range(self.slots_per_day):
                    if slot in middle_slot_indices: lec_middle.append((day, slot))
                    else: lec_edge.append((day, slot))

                for slot in range(self.slots_per_day - 1):
                    if slot in self.lab_invalid_start_slots:
                        continue
                    if slot in middle_slot_indices or (slot + 1) in middle_slot_indices:
                        lab_middle.append((day, slot))
                    else:
                        lab_edge.append((day, slot))

            random.shuffle(lec_middle); random.shuffle(lec_edge)
            lecture_slots[div] = lec_middle + lec_edge
            random.shuffle(lab_middle); random.shuffle(lab_edge)
            lab_slots[div] = lab_middle + lab_edge

        return lecture_slots, lab_slots

    def find_valid_lab_combination(self, div: str, day: str, slot: int) -> Optional[ConcurrentLabInfo]:
        # This function is also well-structured and doesn't need changes.
        partitions = self.partitions[div]
        num_partitions = len(partitions)
        
        lab_pools = [list(self.unassigned_labs.get(p, [])) for p in partitions]
        if not all(lab_pools):
            return None

        possible_combinations = list(product(*lab_pools))
        random.shuffle(possible_combinations)

        for lab_combo in possible_combinations:
            if len(set(lab_combo)) != num_partitions: continue
            
            faculty_combo = [self._get_faculty(div, subj) for subj in lab_combo]
            if any(f is None for f in faculty_combo) or len(set(faculty_combo)) != num_partitions: continue

            clash = False
            for other_div in self.divisions:
                if other_div == div or self.off_days.get(other_div) == day: continue
                
                for s_offset in [0, 1]:
                    other_class = self.timetable[other_div][day][slot + s_offset]
                    if not other_class: continue

                    other_facs = set()
                    if isinstance(other_class, dict) and other_class.get('subject'):
                        fac = self._get_faculty(other_div, other_class['subject'])
                        if fac: other_facs.add(fac)
                    elif isinstance(other_class, list):
                        other_facs.update(item['faculty'] for item in other_class)
                    
                    if not set(faculty_combo).isdisjoint(other_facs):
                        clash = True
                        break
                if clash: break
            
            if not clash:
                return [{'partition': p, 'lab': lab, 'faculty': fac}
                        for p, lab, fac in zip(partitions, lab_combo, faculty_combo)]
        return None

    def _backtrack(self, class_index: int) -> bool:
        """Corrected backtracking with robust state management."""
        if time.time() - self.start_time > self.timeout:
            self.timed_out = True
            return False
        if class_index >= len(self.all_required_classes):
            return True

        class_info = self.all_required_classes[class_index]
        div = class_info['division']
        class_type = class_info['type']
        
        possible_slots = (
            self.possible_lab_slots[div] if class_type != 'Lec'
            else self.possible_lecture_slots[div]
        )

        for day, slot_idx in possible_slots:
            # --- Single Lecture Placement ---
            if class_type == 'Lec':
                if self.timetable[div][day][slot_idx] is not None: continue
                subject = class_info['subject']
                fac = self._get_faculty(div, subject)
                if not fac: continue

                clash = False
                for other_div in self.divisions:
                    if other_div == div or self.off_days.get(other_div) == day: continue
                    other_class = self.timetable[other_div][day][slot_idx]
                    if not other_class: continue
                    
                    other_fac = None
                    if isinstance(other_class, dict) and other_class.get('subject'):
                        other_fac = self._get_faculty(other_div, other_class['subject'])
                    elif isinstance(other_class, list):
                        if fac in {item['faculty'] for item in other_class}: clash = True
                    if other_fac == fac: clash = True
                    if clash: break
                if clash: continue

                self.timetable[div][day][slot_idx] = class_info
                if self._backtrack(class_index + 1): return True
                self.timetable[div][day][slot_idx] = None

            # --- Double Period Placement (Labs and Double Lectures) ---
            elif class_type in ['DoubleLec', 'ConcurrentLabBlock']:
                duration = 2
                if slot_idx + duration > self.slots_per_day: continue
                if any(self.timetable[div][day][slot_idx + i] for i in range(duration)): continue
                
                placed_object = None
                if class_type == 'DoubleLec':
                    subject = class_info['subject']
                    fac = self._get_faculty(div, subject)
                    if not fac: continue
                    
                    clash = False
                    for s_offset in range(duration):
                        for other_div in self.divisions:
                            if other_div == div or self.off_days.get(other_div) == day: continue
                            other_class = self.timetable[other_div][day][slot_idx + s_offset]
                            if not other_class: continue
                            
                            other_fac = None
                            if isinstance(other_class, dict) and other_class.get('subject'):
                                other_fac = self._get_faculty(other_div, other_class['subject'])
                            elif isinstance(other_class, list):
                                if fac in {item['faculty'] for item in other_class}: clash = True
                            if other_fac == fac: clash = True
                            if clash: break
                        if clash: break
                    if clash: continue
                    
                    placed_object = class_info

                elif class_type == 'ConcurrentLabBlock':
                    lab_combo = self.find_valid_lab_combination(div, day, slot_idx)
                    if not lab_combo: continue
                    placed_object = lab_combo

                if placed_object:
                    if class_type == 'ConcurrentLabBlock':
                        for lab in placed_object:
                            self.unassigned_labs[lab['partition']].remove(lab['lab'])
                    
                    self.timetable[div][day][slot_idx] = placed_object
                    self.timetable[div][day][slot_idx + 1] = placed_object # Use same object reference
                    
                    if self._backtrack(class_index + 1): return True

                    # Backtrack state correctly
                    self.timetable[div][day][slot_idx] = None
                    self.timetable[div][day][slot_idx + 1] = None
                    if class_type == 'ConcurrentLabBlock':
                        for lab in placed_object:
                            self.unassigned_labs[lab['partition']].add(lab['lab'])

        return False

    def solve(self, timeout: int = 5) -> Dict[str, Dict[str, List[Optional[Dict]]]]:
        self.start_time = time.time()
        self.timeout = timeout
        self.timed_out = False
        success = self._backtrack(0)
        return self.timetable if success else {}