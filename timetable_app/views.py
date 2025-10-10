# timetable_app/views.py

from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from collections import defaultdict
import json

# Make sure to import ALL your required models, including Semester
from .models import (
    Semester, 
    Subject, 
    Division, 
    Faculty, 
    FacultyAssignment, 
    Setting, 
    TimetableResult, 
    FacultyAvailability
)
from .timetablegenerator_django import TimetableSolver

def generate_config_from_models(semester, existing_faculty_schedule=set()):
    # ... (function body remains identical) ...
    config = {
        'settings': {},
        'divisions': {},
        'subjects': {},
        'faculty': {},
        'faculty_assignments': defaultdict(dict),
        'faculty_unavailability': set()
    }

    settings_data = {s.key: s.value for s in Setting.objects.all()}
    config['settings']['working_days'] = settings_data.get('working_days',[])
    config['settings']['periods_per_day'] = settings_data.get('periods_per_day',[])
    config['settings']['breaks_after_period'] = settings_data.get('breaks_after_period', {})
    
    config['faculty'] = {f.code: {'name': f.name} for f in Faculty.objects.all()}

    divisions_in_semester = Division.objects.filter(semester=semester)
    subjects_in_semester = Subject.objects.filter(semester=semester)
    assignments_in_semester = FacultyAssignment.objects.filter(subject__semester=semester)

    for div in divisions_in_semester:
        config['divisions'][div.code] = {'off_day': div.off_day, 'partitions': div.get_partitions_list()}

    for sub in subjects_in_semester:
        config['subjects'][sub.code] = {
            'name': sub.name, 'lectures': sub.lectures, 'labs': sub.labs, 'double_periods': sub.double_periods
        }

    for assignment in assignments_in_semester:
        config['faculty_assignments'][assignment.subject.code][assignment.division.code] = assignment.faculty.code

    for ua in FacultyAvailability.objects.select_related('faculty'):
        config['faculty_unavailability'].add((ua.faculty.code, ua.day, ua.slot_index))
    
    config['faculty_unavailability'].update(existing_faculty_schedule)

    return config


def generate_single_semester_view(request, semester_id):
    """
    Generates a timetable for only ONE specified semester, converts data 
    for template compatibility, and saves the full result.
    """
    semester = get_object_or_404(Semester, number=semester_id)
    start_time = timezone.now()
    print("stated generating timetablein single semester")

    config = generate_config_from_models(semester)

    print("calling timetablesolver")
    solver = TimetableSolver(config)
    success, timetable_result = solver.solve(timeout=30) 

    print('checling constrain in single semseter')
    if not success:
        error_message = f"Failed to generate timetable for {semester.name}. The constraints might be too tight."
        return render(request, 'timetable_app/timetable_result.html', {
            'error': error_message,
            'semester': semester,
        })

    # --- 1. SOLVER OUTPUT CONVERSION TO STANDARD DICT ---
    final_timetable_data = {}
    for div, days in timetable_result.items():
        final_timetable_data[div] = dict(days) 

    # --- 2. PREPARE TEMPLATE-FRIENDLY STRUCTURE (CRITICAL FIX) ---
    template_ready_timetable = {}
    slots_per_day_count = len(config['settings']['periods_per_day'])

    for div_code, days_data in final_timetable_data.items():
        division_off_day = config['divisions'].get(div_code, {}).get('off_day')
        day_schedule_list = []
        
        for day_name in config['settings']['working_days']:
            
            # If it's an off day, set the flag and skip processing
            if day_name == division_off_day:
                day_schedule_list.append({
                    'name': day_name,
                    'is_offday': True,
                    'slots': [None] * slots_per_day_count
                })
                continue
            
            # --- Detailed Slot Processing for Labs/Double Lectures ---
            raw_day_slots = days_data.get(day_name, [None] * slots_per_day_count)
            final_day_slots = []
            i = 0
            
            while i < len(raw_day_slots):
                cell = raw_day_slots[i]
                
                if cell is None:
                    final_day_slots.append(None)
                    i += 1
                    continue
                
                # Determine multi-slot types and length
                is_double_lec = (
                    isinstance(cell, dict) and cell.get('subject') and
                    i + 1 < len(raw_day_slots) and cell == raw_day_slots[i+1]
                )
                is_lab_block = isinstance(cell, list)
                
                
                if is_double_lec:
                    # Double Lecture: Process current slot, advance index by 2
                    entry = cell.copy()
                    fac_code = solver._get_faculty(div_code, entry['subject'], "lecture")
                    entry['faculty'] = fac_code
                    entry['type'] = 'DoubleLec'
                    
                    final_day_slots.append(entry)
                    final_day_slots.append({'type': 'Placeholder'}) 
                    i += 2 

                elif is_lab_block:
                    # Lab Block: Process current slot, advance index by 2
                    entry = {'type': 'LabBlock', 'details': cell}
                    final_day_slots.append(entry)
                    
                    span = 2 
                    for _ in range(1, span):
                        final_day_slots.append({'type': 'Placeholder'})
                    i += span 
                
                elif isinstance(cell, dict) and cell.get('subject'):
                    # Single Lecture
                    entry = cell.copy()
                    fac_code = solver._get_faculty(div_code, entry['subject'], "lecture")
                    entry['faculty'] = fac_code
                    entry['type'] = 'Lec'
                    
                    final_day_slots.append(entry)
                    i += 1
                
                else:
                    final_day_slots.append(None)
                    i += 1

            day_schedule_list.append({
                'name': day_name,
                'is_offday': False, 
                'slots': final_day_slots
            })
        
        template_ready_timetable[div_code] = day_schedule_list

    # --- 3. SAVE AND RENDER ---
    timetable_json_data = json.dumps(final_timetable_data)
    
    result = TimetableResult(
        solution_found=True,
        runtime_seconds=(timezone.now() - start_time).total_seconds(),
        timetable_json=timetable_json_data
    )
    # print("JSON DATA :",timetable_json_data)
    print("RAW SLOTS (before loop):", raw_day_slots)
    result.save()
    
    context = {
        'timetable': template_ready_timetable, 
        'result': result,
        'semester': semester,
        'divisions': dict(config.get('divisions', {})), 
        'working_days': config.get('settings', {}).get('working_days', []),
        'slots': {i: slot for i, slot in enumerate(config.get('settings', {}).get('periods_per_day', []))},
    }

    return render(request, 'timetable_app/timetable_result.html', context)

def generate_department_timetable_view(request):
    start_time = timezone.now()
    all_semesters = Semester.objects.all().order_by('-name')
    
    master_faculty_schedule = set()
    department_timetable = {}

    for semester in all_semesters:
        config = generate_config_from_models(semester, master_faculty_schedule)
        solver = TimetableSolver(config)
        success, semester_timetable = solver.solve(timeout=60)
        
        if not success:
            error_message = f"Failed to generate timetable for {semester.name}."
            return render(request, 'timetable_app/timetable_result.html', {'error': error_message, 'semester': semester})

        department_timetable[semester.name] = semester_timetable
        
        for div_code, days in semester_timetable.items():
            for day, slots in days.items():
                for i, cell in enumerate(slots):
                    if cell is None: continue
                    faculty_in_cell = []
                    if isinstance(cell, dict) and cell.get('subject'):
                        fac_code = solver._get_faculty(div_code, cell['subject'])
                        if fac_code: faculty_in_cell.append(fac_code)
                    elif isinstance(cell, list):
                        faculty_in_cell.extend([item['faculty'] for item in cell])
                    for fac in set(faculty_in_cell):
                        master_faculty_schedule.add((fac, day, i))

    serializable_department_timetable = {
        sem: {
            div: dict(days) for div, days in sem_tt.items()
        } for sem, sem_tt in department_timetable.items()
    }
    
    timetable_json_data = json.dumps(serializable_department_timetable)
    
    result = TimetableResult(
        solution_found=True,
        runtime_seconds=(timezone.now() - start_time).total_seconds(),
        timetable_json=timetable_json_data
    )
    result.save()

    context = {
        'department_timetable': serializable_department_timetable,
        'result': result,
    }
    return render(request, 'timetable_app/department_result.html', context)