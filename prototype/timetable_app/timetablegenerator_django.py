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
    """
    A fully configurable and dynamic CSP solver for generating university timetables.
    It can handle any number of partitions per division as defined in the config.
    """
    def __init__(self, config: Dict):
        # Load all settings from the configuration dictionary
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
        required = []
        for div in self.divisions:
            for sub, details in self.subjects.items():
                for _ in range(details.get('lectures', 0)):
                    required.append({'type': 'Lec', 'division': div, 'subject': sub})
            # A ConcurrentLabBlock is required for each unique lab subject
            for _ in range(len(self.lab_subjects)):
                required.append({'type': 'ConcurrentLabBlock', 'division': div})

        blocks = [c for c in required if c['type'] == 'ConcurrentLabBlock']
        lectures = [c for c in required if c['type'] == 'Lec']
        random.shuffle(blocks); random.shuffle(lectures)
        return blocks + lectures

    def _precompute_possible_slots(self) -> Tuple[Dict[str, list], Dict[str, list]]:
        lecture_slots, lab_slots = {}, {}
        # Slots excluding first and last
        middle_slot_indices = list(range(1, self.slots_per_day - 1)) 

        for div in self.divisions:
            lec_middle, lec_edge, lab_middle, lab_edge = [], [], [], []
            for day in self.working_days:
                if day == self.off_days.get(div): continue

                for slot in range(self.slots_per_day):
                    if slot in middle_slot_indices: lec_middle.append((day, slot))
                    else: lec_edge.append((day, slot))

                for slot in range(self.slots_per_day - 1): # Labs take 2 slots, so max start is length-2
                    if slot in self.lab_invalid_start_slots: continue
                    # A slot is 'middle' if it or the next slot falls in the middle range
                    if slot in middle_slot_indices or (slot + 1) in middle_slot_indices:
                        lab_middle.append((day, slot))
                    else: lab_edge.append((day, slot))

            random.shuffle(lec_middle); random.shuffle(lec_edge)
            lecture_slots[div] = lec_middle + lec_edge

            random.shuffle(lab_middle); random.shuffle(lab_edge)
            lab_slots[div] = lab_middle + lab_edge

        return lecture_slots, lab_slots

    def _get_faculty(self, division: str, subject_code: str) -> str:
        return self.faculty_assignments[subject_code][division]

    def _is_valid_slot(self, div: str, class_type: str, day: str, slot_idx: int) -> bool:
        if self.timetable[div][day][slot_idx] is not None: return False
        if class_type != 'Lec':
            # Check the second slot for a two-period lab block
            if slot_idx + 1 >= self.slots_per_day or self.timetable[div][day][slot_idx + 1] is not None: return False
        return True

    def find_valid_lab_combination(self, div: str, day: str, slot: int) -> Optional[ConcurrentLabInfo]:
        partitions = self.partitions[div]
        num_partitions = len(partitions)

        lab_pools = [list(self.unassigned_labs[p]) for p in partitions]
        possible_combinations = list(product(*lab_pools))
        random.shuffle(possible_combinations)

        for lab_combo in possible_combinations:
            # CONSTRAINT 1: Each lab in the concurrent block must be a different subject.
            if len(set(lab_combo)) != num_partitions: continue
            
            faculty_combo = [self._get_faculty(div, subj) for subj in lab_combo]
            # CONSTRAINT 2: Each faculty in the concurrent block must be unique.
            if len(set(faculty_combo)) != num_partitions: continue

            # CONSTRAINT 3: Faculty must not be busy elsewhere (Lec or other Concurrent Lab)
            clash = False
            for other_div in self.divisions:
                if other_div == div or self.off_days.get(other_div) == day: continue
                
                # Check both lab slots
                for s_offset in [0, 1]: 
                    if slot + s_offset >= self.slots_per_day: continue # Should only happen on edge case which is prevented by lab slot checks, but safe check
                    other_class = self.timetable[other_div][day][slot + s_offset]
                    if not other_class: continue

                    if isinstance(other_class, dict) and other_class.get('type') == 'Lec':
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
            # Final check: Ensure every partition has been assigned all its required labs
            return all(not labs for labs in self.unassigned_labs.values())

        class_info = self.all_required_classes[class_index]
        div = class_info['division']
        class_type = class_info['type']

        possible_slots = self.possible_lab_slots[div] if class_type == 'ConcurrentLabBlock' else self.possible_lecture_slots[div]

        for day, slot_idx in possible_slots:
            if self._is_valid_slot(div, class_type, day, slot_idx):
                if class_type == 'Lec':
                    subject = class_info['subject']
                    is_valid_lec = True
                    
                    # Constraint: Max one class of a subject per day
                    for s in self.timetable[div][day]:
                        if isinstance(s, dict) and s.get('subject') == subject:
                            is_valid_lec = False; break
                    if not is_valid_lec: continue
                    
                    # Constraint: Faculty availability
                    fac = self._get_faculty(div, subject)
                    for other_div in self.divisions:
                          if other_div == div or self.off_days.get(other_div) == day: continue
                          other_class = self.timetable[other_div][day][slot_idx]
                          if other_class:
                              if isinstance(other_class, dict) and other_class.get('type') == 'Lec':
                                  if self._get_faculty(other_div, other_class['subject']) == fac: is_valid_lec = False
                              elif isinstance(other_class, list): # Clash with a concurrent lab block
                                  if fac in {item['faculty'] for item in other_class}: is_valid_lec = False
                          if not is_valid_lec: break
                    if not is_valid_lec: continue

                    # Assignment and Recursion for Lecture
                    self.timetable[div][day][slot_idx] = class_info
                    if self._backtrack(class_index + 1): return True
                    self.timetable[div][day][slot_idx] = None # Backtrack

                elif class_type == 'ConcurrentLabBlock':
                    combination = self.find_valid_lab_combination(div, day, slot_idx)
                    if combination:
                        # Assignment and state update for Lab
                        for lab_info in combination:
                            self.unassigned_labs[lab_info['partition']].remove(lab_info['lab'])
                        self.timetable[div][day][slot_idx] = combination
                        self.timetable[div][day][slot_idx+1] = combination

                        if self._backtrack(class_index + 1): return True

                        # Backtrack: Restore state
                        for lab_info in combination:
                            self.unassigned_labs[lab_info['partition']].add(lab_info['lab'])
                        self.timetable[div][day][slot_idx] = None
                        self.timetable[div][day][slot_idx+1] = None
        return False

    def solve(self, timeout: int = 60) -> bool:
        self.start_time = time.time(); self.timeout = timeout; self.timed_out = False
        # Initialize unassigned labs for every partition
        for div in self.divisions:
            for p in self.partitions.get(div, []):
                self.unassigned_labs[p] = self.lab_subjects.copy()
        return self._backtrack(0)

    def print_timetable(self):
        for div in self.divisions:
            partition_names = self.partitions.get(div, [])
            div_header = f"DIVISION {div}"
            if partition_names:
                div_header += f" ({' & '.join(partition_names)})"

            print(f"\n--- TIMETABLE FOR {div_header} (Off on {self.off_days.get(div)}) ---")

            lec_width = 24
            num_partitions = len(partition_names) if partition_names else 1
            # Calculate width for the concurrent lab display
            lab_width = (lec_width * num_partitions) + ((num_partitions - 1) * 3) 

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
                    if cell:
                        if isinstance(cell, dict) and cell.get('type') == 'Lec':
                            # Single period lecture
                            display = f"{cell['subject']}-Lec ({self._get_faculty(div, cell['subject'])})"
                            row_str += f" | {display:<{lec_width}}"; slot_idx += 1
                        elif isinstance(cell, list):
                            # Two-period concurrent lab block
                            display_parts = [f"{item['partition']}: {item['lab']} ({item['faculty']})" for item in cell]
                            # Use ' / ' to separate partition/lab/faculty info
                            display = " / ".join(display_parts)
                            row_str += f" | {display:^{lab_width}}"; slot_idx += 2
                    else:
                        # Free slot
                        row_str += f" | {'--- FREE ---':<{lec_width}}"; slot_idx += 1
                    
                    # Add break column if it follows the slot just processed
                    if (slot_idx - 1) in self.breaks: row_str += f" | {'-'*15:^15}"
                print(row_str)

def load_config(filename: str) -> Dict:
    """Loads the configuration from a JSON file."""
    try:
        with open(filename, 'r') as f: return json.load(f)
    except FileNotFoundError: print(f"Error: Configuration file '{filename}' not found."); return None
    except json.JSONDecodeError: print(f"Error: Could not decode JSON from '{filename}'."); return None

if __name__ == '__main__':
    # NOTE: You must have a 'config.json' file in the same directory for this to run.
    config_data = load_config('config.json')
    if config_data:
        solver = TimetableSolver(config_data)
        print("Generating dynamic timetable with heuristic search...")
        
        # Increased timeout to 90 seconds for complex problems
        if solver.solve(timeout=90):
            elapsed_time = time.time() - solver.start_time
            print(f"\n✅ Timetable generated successfully in {elapsed_time:.2f} seconds!")
            solver.print_timetable()
        else:
            elapsed_time = time.time() - solver.start_time
            if solver.timed_out: print(f"\n❌ Solver stopped after {solver.timeout} seconds. No solution found. The problem may be unsolvable with the given constraints.")
            else: print(f"\n❌ Could not generate a valid timetable in {elapsed_time:.2f} seconds.")