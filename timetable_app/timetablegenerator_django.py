import random
import time
from collections import defaultdict
from typing import Dict, List, Optional, TypedDict, Set, Tuple
from itertools import product

# --- Type Definitions (UNCHANGED) ---
LabInfo = TypedDict('LabInfo', {'partition': str, 'lab': str, 'faculty': str})
ConcurrentLabInfo = List[LabInfo]
ClassInfo = TypedDict('ClassInfo', {'type': str, 'division': str, 'subject': Optional[str]})


class TimetableSolver:
    """
    A configurable and optimized CSP solver for university timetables with
    enhanced constraints for speed and quality. Includes COMPACTION logic.
    """
    def __init__(self, config: Dict):
        print("initialising data in timetable solver")
        self.config = config
        self.working_days = config['settings']['working_days']
        self.slots = config['settings']['periods_per_day']
        self.subjects = config['subjects']
        self.divisions = list(config['divisions'].keys())
        self.off_days = {div: data['off_day'] for div, data in config['divisions'].items()}
        self.partitions = {div: data['partitions'] for div, data in config['divisions'].items()}
        self.faculty_assignments = config['faculty_assignments']
        self.faculty_unavailability = config.get('faculty_unavailability', set())

        self.slots_per_day = len(self.slots)
        self.breaks = {int(p) - 1: d for p, d in config['settings'].get('breaks_after_period', {}).items()}
        self.lab_invalid_start_slots = {int(p) - 1 for p in config['settings'].get('breaks_after_period', {})}
        
        self.max_labs_per_day = config['settings'].get('max_labs_per_day', 4) 

        self.timetable: Dict[str, Dict[str, List[Optional[Dict]]]] = {
            div: {day: [None] * self.slots_per_day for day in self.working_days}
            for div in self.divisions
        }
        
        self.daily_schedule_tracker = defaultdict(lambda: defaultdict(lambda: {
            'subjects': set(),
            'labs': 0
        }))

        self.unassigned_labs: Dict[str, Set[str]] = defaultdict(set)
        lab_subjects = {sub for sub, details in self.subjects.items() if details.get('labs', 0) > 0}
        
        # FIX 1: Corrected call to _get_faculty in __init__
        for div, div_partitions in self.partitions.items():
            # A subject is valid for labs if it has EITHER a lecture faculty OR a lab faculty assigned
            lab_subjects_for_div = {
                sub for sub in lab_subjects 
                if self._get_faculty(div, sub, 'lecture') or self._get_faculty(div, sub, 'lab')
            }
            for partition in div_partitions:
                self.unassigned_labs[partition].update(lab_subjects_for_div)

        # FIX: The required classes list now includes a pre-sort to improve heuristic
        self.all_required_classes = self._create_required_classes_list()
        self.possible_lecture_slots, self.possible_lab_slots = self._precompute_possible_slots()
        
        self.start_time: float = 0.0
        self.timeout: int = 0
        self.timed_out: bool = False

    def _get_faculty(self, division: str, subject_code: Optional[str], activity_type: str) -> Optional[str]:
        """
        Retrieves the assigned faculty code for a subject/division based on the 
        activity type ('lecture' or 'lab') from the complex config structure.
        """
        if not subject_code:
            return None
        
        assignment = self.faculty_assignments.get(subject_code, {}).get(division)
        
        if isinstance(assignment, str):
            return assignment
            
        if isinstance(assignment, dict):
            return assignment.get(activity_type)
            
        return None

    def _is_placement_compact(self, div: str, day: str, slot_idx: int) -> bool:
        """
        Enforces that no single free hour is left between placed classes or before the first class.
        """
        if slot_idx == 0:
            return True
            
        previous_slot_idx = slot_idx - 1
        
        if self.timetable[div][day][previous_slot_idx] is not None:
            return True

        if previous_slot_idx in self.breaks:
            return True
        
        if any(self.timetable[div][day][s] is not None for s in range(previous_slot_idx)):
              return False
              
        return True

    def _create_required_classes_list(self) -> List[ClassInfo]:
        """
        Builds a list of all classes to be scheduled, prioritizing blocks and 
        subjects with more total classes (heuristic).
        """
        required = []
        for div in self.divisions:
            num_lab_sessions_for_div = sum(
                1 for sub, details in self.subjects.items()
                # FIX 2: Corrected call to _get_faculty here
                if details.get('labs', 0) > 0 and (self._get_faculty(div, sub, 'lecture') or self._get_faculty(div, sub, 'lab'))
            )
            for _ in range(num_lab_sessions_for_div):
                required.append({'type': 'ConcurrentLabBlock', 'division': div, 'subject': None})
            
            for sub, details in self.subjects.items():
                # FIX 3: Corrected call to _get_faculty here
                if not (self._get_faculty(div, sub, 'lecture') or self._get_faculty(div, sub, 'lab')):
                    continue
                for _ in range(details.get('double_periods', 0)):
                    required.append({'type': 'DoubleLec', 'division': div, 'subject': sub})
                for _ in range(details.get('lectures', 0)):
                    required.append({'type': 'Lec', 'division': div, 'subject': sub})

        # ⭐ OPTIMIZATION FIX: Prioritize hard-to-place blocks and more frequent subjects.
        def class_priority(class_info):
            class_type = class_info['type']
            subject_code = class_info['subject']
            
            # Priority 1: Place Concurrent Labs first (most restrictive)
            if class_type == 'ConcurrentLabBlock':
                return 3
            # Priority 2: Place Double Lectures next (still restrictive)
            if class_type == 'DoubleLec':
                return 2
            # Priority 3: Single Lectures (Least restrictive)
            if class_type == 'Lec':
                # Secondary sort: prioritize subjects with more total weekly hours to compact them earlier.
                if subject_code:
                    details = self.subjects.get(subject_code, {})
                    total_hours = details.get('lectures', 0) + 2 * details.get('double_periods', 0)
                    return 1 + total_hours / 100 # Add a small number based on size
            return 1 # Fallback for lectures
            
        required.sort(key=class_priority, reverse=True) # Sort in descending priority
        
        return required

    def _precompute_possible_slots(self) -> Tuple[Dict[str, list], Dict[str, list]]:
        # Logic remains the same (unchanged)
        lecture_slots, lab_slots = {}, {}
        for div in self.divisions:
            lec_slots_for_div, lab_slots_for_div = [], []
            for day in self.working_days:
                if day == self.off_days.get(div):
                    continue
                lec_slots_for_div.extend([(day, s) for s in range(self.slots_per_day)])
                
                valid_lab_starts = [s for s in range(self.slots_per_day - 1) 
                                     if s not in self.lab_invalid_start_slots]
                lab_slots_for_div.extend([(day, s) for s in valid_lab_starts])
            
            lecture_slots[div] = lec_slots_for_div
            lab_slots[div] = lab_slots_for_div
        return lecture_slots, lab_slots

    def find_valid_lab_combination(self, div: str, day: str, slot: int) -> Optional[ConcurrentLabInfo]:
        partitions = self.partitions[div]
        lab_pools = [list(self.unassigned_labs.get(p, [])) for p in partitions]
        if not all(lab_pools): return None

        possible_combinations = list(product(*lab_pools))
        random.shuffle(possible_combinations)

        for lab_combo in possible_combinations:
            if len(set(lab_combo)) != len(partitions): continue
            
            # FIX: Call _get_faculty with 'lab' activity type
            faculty_combo = [self._get_faculty(div, subj, 'lab') for subj in lab_combo]
            
            if any(f is None for f in faculty_combo): continue 
            if len(set(faculty_combo)) != len(partitions): continue 

            is_unavailable = False
            for fac in faculty_combo:
                if (fac, day, slot) in self.faculty_unavailability or \
                   (fac, day, slot + 1) in self.faculty_unavailability:
                    is_unavailable = True
                    break
            if is_unavailable: continue

            clash = False
            for s_offset in range(2):
                current_slot = slot + s_offset
                for other_div in self.divisions:
                    if other_div == div or self.off_days.get(other_div) == day: continue
                    other_class = self.timetable[other_div][day][current_slot]
                    if not other_class: continue

                    other_facs = set()
                    if isinstance(other_class, dict):
                        # FIX: Call _get_faculty with 'lecture' activity type
                        fac = self._get_faculty(other_div, other_class.get('subject'), 'lecture')
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
        # Core logic is sound, focusing on argument fix in placement calls
        if time.time() - self.start_time > self.timeout:
            self.timed_out = True
            return False
        if class_index >= len(self.all_required_classes):
            return True

        class_info = self.all_required_classes[class_index]
        div = class_info['division']
        class_type = class_info['type']
        
        possible_slots_list = (
            self.possible_lab_slots[div] if class_type != 'Lec'
            else self.possible_lecture_slots[div]
        )

        for day, slot_idx in possible_slots_list:
            
            if not self._is_placement_compact(div, day, slot_idx):
                continue
            
            # --- Single Lecture Placement ---
            if class_type == 'Lec':
                subject = class_info['subject']
                # FIX: Call _get_faculty with 'lecture' activity type
                fac = self._get_faculty(div, subject, 'lecture')
                
                # Check 1: Base feasibility and mandatory constraints
                if (fac, day, slot_idx) in self.faculty_unavailability: continue
                if self.timetable[div][day][slot_idx] is not None: continue
                if subject in self.daily_schedule_tracker[div][day]['subjects']: continue
                if not fac: continue

                # Check 2: Faculty Clash - Cross-Division (Single Slot)
                clash = False
                for other_div in self.divisions:
                    if other_div == div or self.off_days.get(other_div) == day: continue
                    other_class = self.timetable[other_div][day][slot_idx]
                    if not other_class: continue
                    other_facs = set()
                    if isinstance(other_class, dict):
                        # FIX: Call _get_faculty with 'lecture' activity type
                        other_fac = self._get_faculty(other_div, other_class.get('subject'), 'lecture')
                        if other_fac: other_facs.add(other_fac)
                    elif isinstance(other_class, list):
                        other_facs.update(item['faculty'] for item in other_class)
                    
                    if fac in other_facs:
                        clash = True
                        break
                if clash: continue

                # Place and Recurse
                self.timetable[div][day][slot_idx] = class_info
                self.daily_schedule_tracker[div][day]['subjects'].add(subject)
                if self._backtrack(class_index + 1): return True
                self.daily_schedule_tracker[div][day]['subjects'].remove(subject)
                self.timetable[div][day][slot_idx] = None

            # --- Double Period/Lab Block Placement ---
            elif class_type in ['DoubleLec', 'ConcurrentLabBlock']:
                duration = 2
                
                # Check 1: Base feasibility and mandatory constraints (2 slots)
                if slot_idx + duration > self.slots_per_day: continue
                if any(self.timetable[div][day][slot_idx + i] for i in range(duration)): continue

                placed_object = None
                
                if class_type == 'DoubleLec':
                    subject = class_info['subject']
                    # FIX: Call _get_faculty with 'lecture' activity type
                    fac = self._get_faculty(div, subject, 'lecture')
                    
                    # Check 2: Mandatory Constraints for Double Lecture
                    if (fac, day, slot_idx) in self.faculty_unavailability or \
                       (fac, day, slot_idx + 1) in self.faculty_unavailability: continue
                    if subject in self.daily_schedule_tracker[div][day]['subjects']: continue
                    if not fac: continue
                    
                    # Check 3: Faculty Clash - Cross-Division (Two Slots)
                    clash = False
                    for s_offset in range(duration):
                        for other_div in self.divisions:
                            if other_div == div or self.off_days.get(other_div) == day: continue
                            other_class = self.timetable[other_div][day][slot_idx + s_offset]
                            if not other_class: continue
                            other_facs = set()
                            if isinstance(other_class, dict):
                                # FIX: Call _get_faculty with 'lecture' activity type
                                other_fac = self._get_faculty(other_div, other_class.get('subject'), 'lecture')
                                if other_fac: other_facs.add(other_fac)
                            elif isinstance(other_class, list):
                                other_facs.update(item['faculty'] for item in other_class)
                            if fac in other_facs: clash = True
                            if clash: break
                        if clash: break
                    if clash: continue
                    placed_object = class_info

                elif class_type == 'ConcurrentLabBlock':
                    # Check 2: Mandatory Constraints for Lab Block
                    if self.daily_schedule_tracker[div][day]['labs'] >= self.max_labs_per_day: continue 
                    
                    # Check 3: Complex Lab Constraint Validation 
                    lab_combo = self.find_valid_lab_combination(div, day, slot_idx)
                    if not lab_combo: continue
                    placed_object = lab_combo

                # Place and Recurse (Common for Double Lec and Lab)
                if placed_object:
                    if class_type == 'DoubleLec':
                        self.daily_schedule_tracker[div][day]['subjects'].add(placed_object['subject'])
                    
                    # --- CRITICAL FIX: These lines occupy the 2 slots ---
                    self.timetable[div][day][slot_idx] = placed_object 
                    self.timetable[div][day][slot_idx + 1] = placed_object
                    # --- END CRITICAL FIX ---

                    if class_type == 'ConcurrentLabBlock':
                        self.daily_schedule_tracker[div][day]['labs'] += 1
                        for lab in placed_object:
                            self.unassigned_labs[lab['partition']].remove(lab['lab'])
                        
                    if self._backtrack(class_index + 1): return True

                    # Backtrack (Remove the 2 slots)
                    self.timetable[div][day][slot_idx] = None
                    self.timetable[div][day][slot_idx + 1] = None
                    
                    if class_type == 'DoubleLec':
                        self.daily_schedule_tracker[div][day]['subjects'].remove(placed_object['subject'])
                    elif class_type == 'ConcurrentLabBlock':
                        self.daily_schedule_tracker[div][day]['labs'] -= 1
                        for lab in placed_object:
                            self.unassigned_labs[lab['partition']].add(lab['lab'])
        return False

    def solve(self, timeout: int = 30) -> Tuple[bool, Dict]:
        self.start_time = time.time()
        self.timeout = timeout
        self.timed_out = False
        
        for div, day in self.off_days.items():
            if day in self.timetable[div]:
                self.timetable[div][day] = [None] * self.slots_per_day
        
        success = self._backtrack(0)
        
        if self.timed_out:
            return False, {}
        if success:
            return True, self.timetable
        else:
            return False, {}