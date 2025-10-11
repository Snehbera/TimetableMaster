# timetable_app/views.py

from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from collections import defaultdict
import json
from .timetablegenerator_django import TimetableSolver

from requests import Response
from django.db import transaction  # For safe database operations
# DRF Imports for the API view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Your models and solver
from .models import Semester, Subject, Division, Faculty, FacultyAssignment, Setting, TimetableResult
from .timetablegenerator_django import TimetableSolver
from .helper_views import *
from django.contrib.auth import get_user_model


def _process_solver_output(solver, config, raw_timetable_data):
    """
    Takes the raw solver output and converts it into a template-friendly 
    structure by adding 'type', 'faculty', and 'Placeholder' cells.
    (This function remains unchanged from your provided code)
    """
    template_ready_timetable = {}
    slots_per_day_count = len(config['settings']['periods_per_day'])
    working_days = config['settings']['working_days']

    for div_code, raw_days_data in raw_timetable_data.items():
        division_off_day = config['divisions'].get(div_code, {}).get('off_day')
        day_schedule_list = []
        
        for day_name in working_days:
            
            # Check for OFF DAY first
            if day_name == division_off_day:
                day_schedule_list.append({
                    'name': day_name,
                    'is_offday': True,
                    'slots': [{'type': 'OffDay'}] * slots_per_day_count
                })
                continue
            
            raw_day_slots = raw_days_data.get(day_name, [None] * slots_per_day_count)
            final_day_slots = []
            i = 0
            
            while i < len(raw_day_slots):
                cell = raw_day_slots[i]
                
                if cell is None:
                    final_day_slots.append(None)
                    i += 1
                    continue
                
                if isinstance(cell, dict) and cell.get('type') == 'Placeholder':
                    final_day_slots.append({'type': 'Placeholder'})
                    i += 1
                    continue

                is_double_lec = (
                    isinstance(cell, dict) and cell.get('subject') and
                    i + 1 < len(raw_day_slots) and cell == raw_day_slots[i+1]
                )
                is_lab_block = isinstance(cell, list)
                
                if is_double_lec:
                    entry = cell.copy()
                    fac_code = solver._get_faculty(div_code, entry['subject'], "lecture")
                    entry['faculty'] = fac_code
                    entry['type'] = 'DoubleLec'
                    final_day_slots.append(entry)
                    final_day_slots.append({'type': 'Placeholder'}) 
                    i += 2 
                elif is_lab_block:
                    entry = {'type': 'LabBlock', 'details': cell}
                    final_day_slots.append(entry)
                    span = 2 
                    for _ in range(1, span):
                        final_day_slots.append({'type': 'Placeholder'})
                    i += span 
                elif isinstance(cell, dict) and cell.get('subject'):
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
        
    return template_ready_timetable


# ==============================================================================
# 2. CONFIG GENERATION (*** MODIFIED ***)
# ==============================================================================
# In timetable_app/views.py

from collections import defaultdict
from .models import Setting, Faculty, FacultyAvailability, Division, Subject, FacultyAssignment

def generate_config_from_models(user,semester, existing_faculty_schedule=set()):
    """
    Pulls data from models for a SPECIFIC USER to create the configuration
    dictionary for the TimetableSolver.
    """
    config = {
        'settings': {},
        'divisions': {},
        'subjects': {},
        'faculty': {},
        'faculty_assignments': defaultdict(dict),
        'faculty_unavailability': set()
    }

    # --- ALL QUERIES ARE NOW FILTERED BY 'user' ---

    # 1. Populate user-specific settings
    settings_data = {s.key: s.value for s in Setting.objects.filter(user=user)}
    config['settings'].update(settings_data)

    # 2. Populate user-specific faculty
    config['faculty'] = {f.code: {'name': f.name} for f in Faculty.objects.filter(user=user)}

    # 3. Populate user-specific faculty unavailability
    # The 'faculty__user=user' query correctly traverses the relationship
    for availability in FacultyAvailability.objects.filter(faculty__user=user):
        for i in range(1, 7):
            if not getattr(availability, f'slot_{i}', True):
                config['faculty_unavailability'].add(
                    (availability.faculty.code, availability.day, i - 1)
                )
    
    config['faculty_unavailability'].update(existing_faculty_schedule)

    # 4. If a semester is provided, populate user- and semester-specific data
    if semester:
        # Filter by both semester AND user
        divisions = Division.objects.filter(user=user, semester=semester) # ⭐ FILTERED
        subjects = Subject.objects.filter(user=user, semester=semester)   # ⭐ FILTERED
        # Assignments filter via the related Subject/Division which are user-scoped.
        assignments = FacultyAssignment.objects.filter(subject__user=user, subject__semester=semester) # ⭐ FILTERED

        for div in divisions:
            config['divisions'][div.code] = {'off_day': div.off_day, 'partitions': div.get_partitions_list()}
        
        for sub in subjects:
            config['subjects'][sub.code] = {
                'name': sub.name, 'lectures': sub.lectures, 'labs': sub.labs, 'double_periods': sub.double_periods
            }

        for assignment in assignments:
            config['faculty_assignments'][assignment.subject.code][assignment.division.code] = assignment.faculty.code

    return config
# ==============================================================================
# 3. SINGLE SEMESTER VIEW
# ==============================================================================
# timetable_app/views.py (Inside generate_single_semester_view function)

def transform_frontend_json(source_data):
    """
    Converts the JSON from your React frontend into a structured "master"
    format that's easier to load into the database.
    """
    target_json = {}

    # 1. Transform Settings
    settings = {}
    settings['working_days'] = [day['fullName'] for day in source_data.get('days', []) if day.get('isWorkingDay')]
    periods = []
    breaks = {}
    for i, item in enumerate(source_data.get('timings', [])):
        if item['type'] == 'period':
            periods.append(f"{item['startTime']}-{item['endTime']}")
        elif item['type'] == 'break' and i > 0:
            if source_data['timings'][i - 1]['type'] == 'period':
                prev_period_num = source_data['timings'][i - 1]['number']
                breaks[str(prev_period_num)] = f"BREAK ({item['startTime']}-{item['endTime']})"
    settings['periods_per_day'] = periods
    settings['breaks_after_period'] = breaks
    target_json['settings'] = settings

    # 2. Transform Faculty
    faculty = {}
    for fac in source_data.get('faculty', []):
        faculty[fac['shortName']] = {'name': fac['name']}
    target_json['faculty'] = faculty

    # 3. Transform Semester-Specific Data
    semester_key = ''.join(filter(str.isdigit, source_data.get('semester', '')))
    if not semester_key:
        raise ValueError("Semester information is missing from the source JSON.")

    semester_data = {}
    divisions = {}
    division_map = {}
    for room in source_data.get('rooms', []):
        if room.get('type') == 'classroom' and 'timetableName' in room.get('homeRoomFor', {}):
            full_name = room['homeRoomFor']['timetableName']
            code = full_name.split(' - ')[-1].strip()
            division_map[full_name] = code
            if code not in divisions:
                divisions[code] = {'off_day': "None", 'partitions': []}
    
    for room in source_data.get('rooms', []):
        if room.get('type') == 'lab' and 'timetableName' in room.get('homeRoomFor', {}):
            full_name = room['homeRoomFor']['timetableName']
            if full_name in division_map:
                code = division_map[full_name]
                sub_index = room['homeRoomFor'].get('subIndex', 0)
                partition_name = f"{code}{sub_index + 1}"
                if partition_name not in divisions[code]['partitions']:
                    divisions[code]['partitions'].append(partition_name)
    semester_data['divisions'] = divisions
    
    subjects = {}
    for sub in source_data.get('subjects', []):
        subjects[sub['shortName']] = {
            'name': sub['name'],
            'lectures': sub.get('lecturesPerWeek', 0),
            'labs': sub.get('labsPerWeek', 0),
            'double_periods': 1 if sub.get('isDoubleSlot') else 0
        }
    semester_data['subjects'] = subjects

    faculty_assignments = defaultdict(dict)
    assigned_pairs = set()
    for fac in source_data.get('faculty', []):
        faculty_code = fac['shortName']
        for sub_code in fac.get('assignedSubjects', []):
            for div_code in divisions.keys():
                if (sub_code, div_code) not in assigned_pairs:
                    faculty_assignments[sub_code][div_code] = faculty_code
                    assigned_pairs.add((sub_code, div_code))
    semester_data['faculty_assignments'] = dict(faculty_assignments)

    target_json[semester_key] = semester_data
    return target_json

# timetable_app/helper_views.py (or wherever this function is defined)
def import_data(master_json, user): 
    """
    Takes the transformed "master" JSON and saves its data to the
    database, scoped to the provided user.
    """
    
    # --- Clear operations must filter by user ---
    Setting.objects.filter(user=user).delete() # Corrected filter
    FacultyAssignment.objects.filter(subject__user=user).delete() 
    Division.objects.filter(user=user).delete()
    Subject.objects.filter(user=user).delete()
    Semester.objects.filter(user=user).delete()
    Faculty.objects.filter(user=user).delete()


    # Load shared data
    for key, value in master_json.get("settings", {}).items():
        Setting.objects.update_or_create(user=user, key=key, defaults={"value": value})
    
    for code, details in master_json.get("faculty", {}).items():
        Faculty.objects.update_or_create(user=user, code=code, defaults={"name": details["name"]})

    # Process each semester block
    for key, semester_data in master_json.items():
        
        if key.isdigit():
            semester_number = int(key) 
            
            # Use user=user in get_or_create
            semester_obj, _ = Semester.objects.get_or_create(
                user=user, # ⭐ ADDED
                number=semester_number, 
                defaults={'name': f'Semester {semester_number}'}
            )
            # Populate semester-specific data
            for code, details in semester_data.get("subjects", {}).items():
                # ⭐ CRITICAL FIX: Pass user=user
                Subject.objects.update_or_create(user=user, code=code, defaults={**details, "semester": semester_obj})

            for code, details in semester_data.get("divisions", {}).items():
                partitions_str = ",".join(details.get("partitions", []))
                # ⭐ CRITICAL FIX: Pass user=user
                Division.objects.update_or_create(user=user, code=code, defaults={
                    "name": f"{code} Division", "off_day": details.get("off_day"),
                    "partitions": partitions_str, "semester": semester_obj
                })            
            # ... (Faculty Assignment logic remains)

            for subject_code, assignments in semester_data.get("faculty_assignments", {}).items():
                
                # Fetch Subject (must be filtered by user and semester)
                subject_obj = Subject.objects.get(user=user, code=subject_code, semester=semester_obj)
                
                for division_code, faculty_code in assignments.items():
                    
                    # Fetch Division (must be filtered by user and semester)
                    division_obj = Division.objects.get(user=user, code=division_code, semester=semester_obj)
                    
                    # Fetch Faculty (must be filtered by user)
                    faculty_obj = Faculty.objects.get(user=user, code=faculty_code)
                    
                    # Create the Assignment record
                    FacultyAssignment.objects.create(
                        user=user,
                        subject=subject_obj, 
                        division=division_obj, 
                        faculty=faculty_obj
                    )


            return semester_obj
    return None