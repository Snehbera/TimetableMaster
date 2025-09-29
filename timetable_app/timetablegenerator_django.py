# timetable_app/timetablegenerator_django.py (Fixed Clash Detection)

import json
import random
import time
from collections import defaultdict
from typing import Dict, List, Optional, TypedDict, Set, Tuple
from itertools import product

# --- Type Definitions ---
LabInfo = TypedDict('LabInfo', {'partition': str, 'lab': str, 'faculty': str})
ConcurrentLabInfo = List[LabInfo]

class TimetableSolver:
    # ... (init, _create_required_classes_list, _precompute_possible_slots, _get_faculty, _is_valid_slot are CORRECT) ...

    def __init__(self, config: Dict):
        # ... (init content is correct) ...
        self.config = config
        self.working_days = config['settings']['working_days']
        self.slots = config['settings']['periods_per_day']
        self.subjects = config['subjects']
        self.divisions = list(config['divisions'].keys())
        self.off_days = {div: data['off_day'] for div, data in config['divisions'].items()}
        self.partitions = {div: data['partitions'] for div, data in config['divisions'].items()}
        self.faculty_assignments = config['faculty_assignments']

        self.slots_per_day = len(self.slots)
        self.lab_subjects = {s for s, d in self.subjects.items() if d.get('labs', 0) > 0} 

        self.breaks = {int(p) - 1: d for p, d in config['settings']['breaks_after_period'].items()}
        self.lab_invalid_start_slots = {int(p) - 1 for p in config['settings']['breaks_after_period']}

        self.timetable: Dict[str, Dict[str, List[Optional[Dict]]]] = \
            {div: {day: [None] * self.slots_per_day for day in self.working_days} for div in self.divisions}
        self.all_required_classes = self._create_required_classes_list()
        self.possible_lecture_slots, self.possible_lab_slots = self._precompute_possible_slots()
        self.unassigned_labs: Dict[str, Set[str]] = {}
        self.start_time: float = 0.0; self.timeout: int = 0; self.timed_out: bool = False

    def _create_required_classes_list(self) -> List[Dict]:
        # ... (content is correct) ...
        required = []
        for div in self.divisions:
            for sub, details in self.subjects.items():
                
                # --- NEW: Generate Double Lectures ---
                for _ in range(details.get('double_periods', 0)): 
                    required.append({'type': 'DoubleLec', 'division': div, 'subject': sub})
                
                # Generate standard single lectures
                for _ in range(details.get('lectures', 0)):
                    required.append({'type': 'Lec', 'division': div, 'subject': sub})
            
            # Generate Concurrent Lab Blocks
            for _ in range(len(self.lab_subjects)):
                required.append({'type': 'ConcurrentLabBlock', 'division': div})

        blocks = [c for c in required if c['type'] == 'ConcurrentLabBlock']
        doubles = [c for c in required if c['type'] == 'DoubleLec'] 
        lectures = [c for c in required if c['type'] == 'Lec']
        
        random.shuffle(blocks); random.shuffle(doubles); random.shuffle(lectures)
        return blocks + doubles + lectures
    
    def _precompute_possible_slots(self) -> Tuple[Dict[str, list], Dict[str, list]]:
        # ... (content is correct) ...
        lecture_slots, lab_slots = {}, {}
        middle_slot_indices = list(range(1, self.slots_per_day - 1))

        for div in self.divisions:
            lec_middle, lec_edge, lab_middle, lab_edge = [], [], [], []
            for day in self.working_days:
                if day == self.off_days.get(div): continue

                for slot in range(self.slots_per_day):
                    if slot in middle_slot_indices: lec_middle.append((day, slot))
                    else: lec_edge.append((day, slot))

                # Slots for 2-period blocks (Labs and DoubleLec)
                for slot in range(self.slots_per_day - 1):
                    if slot in self.lab_invalid_start_slots: continue
                    if slot in middle_slot_indices or (slot + 1) in middle_slot_indices:
                        lab_middle.append((day, slot))
                    else: lab_edge.append((day, slot))

            random.shuffle(lec_middle); random.shuffle(lec_edge)
            lecture_slots[div] = lec_middle + lec_edge

            random.shuffle(lab_middle); random.shuffle(lab_edge)
            lab_slots[div] = lab_middle + lab_edge

        return lecture_slots, lab_slots

    def _get_faculty(self, division: str, subject_code: str) -> str:
        return self.faculty_assignments.get(subject_code, {}).get(division)

    def _is_valid_slot(self, div: str, class_type: str, day: str, slot_idx: int) -> bool:
        if self.timetable[div][day][slot_idx] is not None: return False
        
        if class_type == 'DoubleLec' or class_type == 'ConcurrentLabBlock':
            if slot_idx + 1 >= self.slots_per_day: return False
            if self.timetable[div][day][slot_idx + 1] is not None: return False
            
        return True

    def find_valid_lab_combination(self, div: str, day: str, slot: int) -> Optional[ConcurrentLabInfo]:
        partitions = self.partitions[div]
        num_partitions = len(partitions)

        lab_pools = [list(self.unassigned_labs[p]) for p in partitions]
        possible_combinations = list(product(*lab_pools))
        random.shuffle(possible_combinations)

        for lab_combo in possible_combinations:
            if len(set(lab_combo)) != num_partitions: continue
            faculty_combo = [self._get_faculty(div, subj) for subj in lab_combo]
            if len(set(faculty_combo)) != num_partitions: continue

            clash = False
            for other_div in self.divisions:
                if other_div == div or self.off_days.get(other_div) == day: continue
                for s_offset in [0, 1]:
                    other_class = self.timetable[other_div][day][slot + s_offset]
                    if not other_class: continue

                    # FIX for AttributeError: Safely check if it is a dict (Lec/DoubleLec) or list (Lab)
                    if isinstance(other_class, dict):
                        other_type = other_class.get('type')
                        if other_type in ('Lec', 'DoubleLec'):
                            other_fac = self._get_faculty(other_div, other_class['subject'])
                            if other_fac in faculty_combo: clash = True
                        
                    elif isinstance(other_class, list):
                        other_facs = {item['faculty'] for item in other_class}
                        if not set(faculty_combo).isdisjoint(other_facs): clash = True

                    if clash: break
                if clash: break

            if not clash:
                return [{'partition': p, 'lab': lab, 'faculty': fac}
                        for p, lab, fac in zip(partitions, lab_combo, faculty_combo)]
        return None

    def _backtrack(self, class_index: int) -> bool:
        if time.time() - self.start_time > self.timeout: self.timed_out = True; return False
        if class_index >= len(self.all_required_classes):
            return all(not labs for labs in self.unassigned_labs.values())

        class_info = self.all_required_classes[class_index]
        div = class_info['division']
        class_type = class_info['type']

        if class_type == 'ConcurrentLabBlock' or class_type == 'DoubleLec':
            possible_slots = self.possible_lab_slots[div]
        else:
            possible_slots = self.possible_lecture_slots[div]


        for day, slot_idx in possible_slots:
            if self._is_valid_slot(div, class_type, day, slot_idx):
                
                if class_type == 'Lec':
                    subject = class_info['subject']
                    is_valid_lec = True
                    
                    for s in self.timetable[div][day]:
                        if isinstance(s, dict) and s.get('subject') == subject:
                            is_valid_lec = False; break
                    if not is_valid_lec: continue
                    
                    fac = self._get_faculty(div, subject)
                    for other_div in self.divisions:
                         if other_div == div or self.off_days.get(other_div) == day: continue
                         other_class = self.timetable[other_div][day][slot_idx]
                         if other_class:
                             if isinstance(other_class, dict): # Check for Lec or DoubleLec
                                 if self._get_faculty(other_div, other_class['subject']) == fac: is_valid_lec = False
                             elif isinstance(other_class, list): # Check for Lab
                                 if fac in {item['faculty'] for item in other_class}: is_valid_lec = False
                         if not is_valid_lec: break
                    if not is_valid_lec: continue

                    self.timetable[div][day][slot_idx] = class_info
                    if self._backtrack(class_index + 1): return True
                    self.timetable[div][day][slot_idx] = None
                
                # --- Double Lecture Logic ---
                elif class_type == 'DoubleLec':
                    subject = class_info['subject']
                    is_valid_double = True
                    fac = self._get_faculty(div, subject)

                    # 1. Check for faculty clash in slot 1 and slot 2 in other divisions
                    for other_div in self.divisions:
                        if other_div == div or self.off_days.get(other_div) == day: continue
                        
                        for s_offset in [0, 1]:
                            other_class = self.timetable[other_div][day][slot_idx + s_offset]
                            if not other_class: continue

                            if isinstance(other_class, dict):
                                if self._get_faculty(other_div, other_class['subject']) == fac: is_valid_double = False
                            elif isinstance(other_class, list):
                                other_facs = {item['faculty'] for item in other_class}
                                if fac in other_facs: is_valid_double = False
                        
                        if not is_valid_double: break
                    
                    if not is_valid_double: continue

                    # 2. Assignment and Recursion
                    self.timetable[div][day][slot_idx] = class_info 
                    self.timetable[div][day][slot_idx + 1] = class_info

                    if self._backtrack(class_index + 1): return True

                    # 3. Backtrack (Unassign)
                    self.timetable[div][day][slot_idx] = None
                    self.timetable[div][day][slot_idx + 1] = None

                elif class_type == 'ConcurrentLabBlock':
                    combination = self.find_valid_lab_combination(div, day, slot_idx)
                    if combination:
                        for lab_info in combination:
                            self.unassigned_labs[lab_info['partition']].remove(lab_info['lab'])
                        self.timetable[div][day][slot_idx] = combination
                        self.timetable[div][day][slot_idx+1] = combination

                        if self._backtrack(class_index + 1): return True

                        for lab_info in combination:
                            self.unassigned_labs[lab_info['partition']].add(lab_info['lab'])
                        self.timetable[div][day][slot_idx] = None
                        self.timetable[div][day][slot_idx+1] = None
        return False

    def solve(self, timeout: int = 60) -> bool:
        self.start_time = time.time(); self.timeout = timeout; self.timed_out = False
        for div in self.divisions:
            for p in self.partitions.get(div, []):
                self.unassigned_labs[p] = self.lab_subjects.copy()
        return self._backtrack(0)

    def print_timetable(self):
        # ... (print_timetable is correct) ...
        for div in self.divisions:
            partition_names = self.partitions.get(div, [])
            div_header = f"DIVISION {div}"
            if partition_names:
                div_header += f" ({' & '.join(partition_names)})"

            print(f"\n--- TIMETABLE FOR {div_header} (Off on {self.off_days.get(div)}) ---")

            lec_width = 24
            num_partitions = len(partition_names) if partition_names else 1
            lab_width = (lec_width * num_partitions) + ((num_partitions - 1) * 3)
            double_lec_width = (lec_width * 2) + 3

            header = f"{'Day':<10}"
            for i, slot_time in enumerate(self.slots):
                header += f" | {slot_time:<{lec_width}}";
                if i in self.breaks: header += f" | {self.breaks[i]:^15}"
            print(header); print("-" * len(header))

            for day in self.working_days:
                if day == self.off_days.get(div): continue
                row_str = f"{day:<10}"; slot_idx = 0
                while slot_idx < self.slots_per_day:
                    cell = self.timetable[div][day][slot_idx]
                    
                    is_double_lec = isinstance(cell, dict) and cell.get('type') == 'DoubleLec'
                    is_lab_block = isinstance(cell, list)
                    
                    if cell and (is_double_lec or is_lab_block):
                        
                        if is_double_lec:
                            if slot_idx + 1 < self.slots_per_day and self.timetable[div][day][slot_idx + 1] is cell:
                                display = f"{cell['subject']}-Lec (DOUBLE) ({self._get_faculty(div, cell['subject'])})"
                                row_str += f" | {display:^{double_lec_width}}"; slot_idx += 2
                            else:
                                slot_idx += 1
                        
                        elif is_lab_block:
                            display_parts = [f"{item['partition']}: {item['lab']} ({item['faculty']})" for item in cell]
                            display = " / ".join(display_parts)
                            row_str += f" | {display:^{lab_width}}"; slot_idx += 2
                            
                    elif isinstance(cell, dict) and cell.get('type') == 'Lec':
                        display = f"{cell['subject']}-Lec ({self._get_faculty(div, cell['subject'])})"
                        row_str += f" | {display:<{lec_width}}"; slot_idx += 1
                    
                    else:
                        row_str += f" | {'--- FREE ---':<{lec_width}}"; slot_idx += 1
                        
                    if (slot_idx - 1) in self.breaks: row_str += f" | {'-'*15:^15}"
                print(row_str)