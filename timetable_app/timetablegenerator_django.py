import json
import random
import time
from collections import defaultdict
from typing import Dict, List, Optional, TypedDict, Set, Tuple
from itertools import product

# --- Type Definitions (unchanged) ---
LabInfo = TypedDict('LabInfo', {'partition': str, 'lab': str, 'faculty': str})
ConcurrentLabInfo = List[LabInfo]
ClassInfo = TypedDict('ClassInfo', {'type': str, 'division': str, 'subject': Optional[str]})


class TimetableSolver:
    """
    A configurable and optimized CSP solver for university timetables with
    enhanced constraints for speed and quality.
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
        
        # New constraint from user request
        self.max_labs_per_day = config['settings'].get('max_labs_per_day', 2)

        # The main timetable structure being built
        self.timetable: Dict[str, Dict[str, List[Optional[Dict]]]] = {
            div: {day: [None] * self.slots_per_day for day in self.working_days}
            for div in self.divisions
        }
        
        # New tracker for daily constraints -> This is key for performance!
        self.daily_schedule_tracker = defaultdict(lambda: defaultdict(lambda: {
            'subjects': set(),
            'labs': 0
        }))

        # Correctly initialize the pool of unassigned labs
        self.unassigned_labs: Dict[str, Set[str]] = defaultdict(set)
        lab_subjects = {sub for sub, details in self.subjects.items() if details.get('labs', 0) > 0}
        for div, div_partitions in self.partitions.items():
            lab_subjects_for_div = {sub for sub in lab_subjects if self._get_faculty(div, sub)}
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
        """
        Builds a list of all classes to be scheduled.
        Scheduling heavier blocks (labs, double lectures) first is a crucial
        heuristic for performance (most-constrained-variable first).
        """
        required = []
        for div in self.divisions:
            num_lab_sessions_for_div = sum(
                1 for sub, details in self.subjects.items()
                if details.get('labs', 0) > 0 and self._get_faculty(div, sub)
            )
            for _ in range(num_lab_sessions_for_div):
                required.append({'type': 'ConcurrentLabBlock', 'division': div, 'subject': None})
            
            for sub, details in self.subjects.items():
                if not self._get_faculty(div, sub):
                    continue
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
        # This function is well-structured and remains unchanged.
        lecture_slots, lab_slots = {}, {}
        for div in self.divisions:
            lec_slots_for_div = []
            lab_slots_for_div = []
            for day in self.working_days:
                if day == self.off_days.get(div):
                    continue
                
                # Possible start slots for single lectures
                lec_slots_for_div.extend([(day, s) for s in range(self.slots_per_day)])
                
                # Possible start slots for 2-period labs/double lectures
                valid_lab_starts = [s for s in range(self.slots_per_day - 1) if s not in self.lab_invalid_start_slots]
                lab_slots_for_div.extend([(day, s) for s in valid_lab_starts])
            
            random.shuffle(lec_slots_for_div)
            lecture_slots[div] = lec_slots_for_div
            random.shuffle(lab_slots_for_div)
            lab_slots[div] = lab_slots_for_div
        return lecture_slots, lab_slots

    def find_valid_lab_combination(self, div: str, day: str, slot: int) -> Optional[ConcurrentLabInfo]:
        # This function is well-structured and remains largely unchanged.
        partitions = self.partitions[div]
        lab_pools = [list(self.unassigned_labs.get(p, [])) for p in partitions]
        if not all(lab_pools): return None

        possible_combinations = list(product(*lab_pools))
        random.shuffle(possible_combinations)

        for lab_combo in possible_combinations:
            if len(set(lab_combo)) != len(partitions): continue
            
            faculty_combo = [self._get_faculty(div, subj) for subj in lab_combo]
            if any(f is None for f in faculty_combo) or len(set(faculty_combo)) != len(partitions): continue

            # Check for faculty clashes with all other divisions
            clash = False
            for s_offset in range(2):
                current_slot = slot + s_offset
                for other_div in self.divisions:
                    if other_div == div or self.off_days.get(other_div) == day: continue
                    
                    other_class = self.timetable[other_div][day][current_slot]
                    if not other_class: continue

                    other_facs = set()
                    if isinstance(other_class, dict) and other_class.get('subject'):
                        fac = self._get_faculty(other_div, other_class['subject'])
                        if fac: other_facs.add(fac)
                    elif isinstance(other_class, list): # It's a lab block
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
        """
        Core recursive backtracking function with optimized constraint checking.
        """
        if time.time() - self.start_time > self.timeout:
            self.timed_out = True
            return False
        if class_index >= len(self.all_required_classes):
            return True # Success

        class_info = self.all_required_classes[class_index]
        div = class_info['division']
        class_type = class_info['type']
        
        possible_slots_list = (
            self.possible_lab_slots[div] if class_type != 'Lec'
            else self.possible_lecture_slots[div]
        )

        for day, slot_idx in possible_slots_list:
            # --- Single Lecture Placement ---
            if class_type == 'Lec':
                subject = class_info['subject']
                fac = self._get_faculty(div, subject)

                # === FAST CONSTRAINT CHECKS ===
                # 1. Is the slot free?
                if self.timetable[div][day][slot_idx] is not None: continue
                # 2. Has this subject already been taught today?
                if subject in self.daily_schedule_tracker[div][day]['subjects']: continue
                # 3. Is the faculty available?
                if not fac: continue
                clash = False
                for other_div in self.divisions:
                    if other_div == div or self.off_days.get(other_div) == day: continue
                    other_class = self.timetable[other_div][day][slot_idx]
                    if not other_class: continue
                    
                    other_fac = self._get_faculty(other_div, other_class.get('subject')) if isinstance(other_class, dict) else None
                    if isinstance(other_class, list): # Check against lab blocks
                        if fac in {item['faculty'] for item in other_class}: clash = True
                    elif other_fac and other_fac == fac: clash = True
                    
                    if clash: break
                if clash: continue

                # === PLACE LECTURE & UPDATE STATE ===
                self.timetable[div][day][slot_idx] = class_info
                self.daily_schedule_tracker[div][day]['subjects'].add(subject)
                
                if self._backtrack(class_index + 1): return True

                # === BACKTRACK: Revert State ===
                self.daily_schedule_tracker[div][day]['subjects'].remove(subject)
                self.timetable[div][day][slot_idx] = None

            # --- Double Period Placement (Labs and Double Lectures) ---
            elif class_type in ['DoubleLec', 'ConcurrentLabBlock']:
                duration = 2
                
                # === FAST CONSTRAINT CHECKS ===
                # 1. Are the slots free?
                if slot_idx + duration > self.slots_per_day: continue
                if any(self.timetable[div][day][slot_idx + i] for i in range(duration)): continue
                
                placed_object = None
                
                if class_type == 'DoubleLec':
                    subject = class_info['subject']
                    fac = self._get_faculty(div, subject)
                    
                    # 2a. Has this subject already been taught today?
                    if subject in self.daily_schedule_tracker[div][day]['subjects']: continue
                    # 3a. Is the faculty available for both slots?
                    if not fac: continue
                    clash = False
                    for s_offset in range(duration):
                        for other_div in self.divisions:
                            if other_div == div or self.off_days.get(other_div) == day: continue
                            other_class = self.timetable[other_div][day][slot_idx + s_offset]
                            if not other_class: continue
                            
                            other_fac = self._get_faculty(other_div, other_class.get('subject')) if isinstance(other_class, dict) else None
                            if isinstance(other_class, list):
                                if fac in {item['faculty'] for item in other_class}: clash = True
                            elif other_fac and other_fac == fac: clash = True
                            
                            if clash: break
                        if clash: break
                    if clash: continue
                    
                    placed_object = class_info

                elif class_type == 'ConcurrentLabBlock':
                    # 2b. Is the daily lab limit reached?
                    if self.daily_schedule_tracker[div][day]['labs'] >= self.max_labs_per_day: continue
                    # 3b. Find a valid, clash-free combination of labs/faculty
                    lab_combo = self.find_valid_lab_combination(div, day, slot_idx)
                    if not lab_combo: continue
                    placed_object = lab_combo

                # If a valid placement was found for either DoubleLec or Lab
                if placed_object:
                    # === PLACE BLOCK & UPDATE STATE ===
                    if class_type == 'DoubleLec':
                        self.daily_schedule_tracker[div][day]['subjects'].add(placed_object['subject'])
                    elif class_type == 'ConcurrentLabBlock':
                        self.daily_schedule_tracker[div][day]['labs'] += 1
                        for lab in placed_object:
                            self.unassigned_labs[lab['partition']].remove(lab['lab'])
                    
                    self.timetable[div][day][slot_idx] = placed_object
                    self.timetable[div][day][slot_idx + 1] = placed_object
                    
                    if self._backtrack(class_index + 1): return True

                    # === BACKTRACK: Revert State ===
                    self.timetable[div][day][slot_idx] = None
                    self.timetable[div][day][slot_idx + 1] = None
                    if class_type == 'DoubleLec':
                        self.daily_schedule_tracker[div][day]['subjects'].remove(placed_object['subject'])
                    elif class_type == 'ConcurrentLabBlock':
                        self.daily_schedule_tracker[div][day]['labs'] -= 1
                        for lab in placed_object:
                            self.unassigned_labs[lab['partition']].add(lab['lab'])
        return False

    def solve(self, timeout: int = 10) -> Dict:
        """
        Attempts to solve the timetable problem.

        Args:
            timeout (int): The maximum time in seconds to search for a solution.

        Returns:
            A tuple containing:
            - bool: True if a solution was found, False otherwise.
            - dict: The generated timetable if successful, otherwise an empty dict.
        """
        self.start_time = time.time()
        self.timeout = timeout
        self.timed_out = False
        
        print("Starting timetable generation...")
        success = self._backtrack(0)
        
        if self.timed_out:
            print(f"Solver timed out after {self.timeout} seconds. No solution found.")
            return {}
        if success:
            print(f"Solution found in {time.time() - self.start_time:.2f} seconds.")
            return self.timetable
        else:
            print("No solution could be found that satisfies all constraints.")
            return {}