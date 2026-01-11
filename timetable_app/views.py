import json
from collections import defaultdict
from django.db import transaction
from django.contrib.auth import get_user_model
from django.shortcuts import render, get_object_or_404
from django.utils import timezone

# Rest Framework Imports
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status

# Internal Imports
from .models import Semester, Subject, Division, Faculty, FacultyAssignment, Setting, TimetableResult, FacultyAvailability
from .timetablegenerator_django import TimetableSolver


# ==============================================================================
#  VIEWS FOR LISTING AND VIEWING SAVED TIMETABLES 
# ==============================================================================

def list_timetables(request):
    """
    Displays a list of all previously generated and saved timetables.
    """
    all_results = TimetableResult.objects.filter(solution_found=True).order_by('-generation_time')
    context = {
        'timetable_results': all_results
    }
    return render(request, 'timetable_app/list_timetables.html', context)

def view_timetable_detail(request, pk):
    """
    Displays a single, specific timetable from the database.
    """
    result = get_object_or_404(TimetableResult, pk=pk)
    
    # We need the config settings to render the template correctly
    # Pass the user from the result so we get the correct faculty/subjects names
    config = generate_config_from_models(result.user, None)
    
    # The solver object is needed for _process_solver_output to get faculty names
    solver = TimetableSolver(config)
    
    # Load the timetable from the JSON field
    raw_timetable_data = result.timetable_json
    
    # Process the raw data just like we do after generation
    template_ready_timetable = _process_solver_output(solver, config, raw_timetable_data)

    # Prepare context for the template
    periods_raw = config.get('settings', {}).get('periods_per_day', [])
    breaks_raw = config.get('settings', {}).get('breaks_after_period', {})
    
    final_slots_list = []
    for i, slot_time in enumerate(periods_raw):
        final_slots_list.append({'index': i, 'time': slot_time, 'type': 'period'})
        if str(i + 1) in breaks_raw:
            final_slots_list.append({'index': None, 'time': breaks_raw[str(i + 1)], 'type': 'break'})

    context = {
        'timetable': template_ready_timetable,
        'result': result,
        'is_viewing_saved': True,
        'working_days': config.get('settings', {}).get('working_days', []),
        'slots_and_breaks': final_slots_list,
    }
    
    return render(request, 'timetable_app/timetable_result.html', context)


# ==============================================================================
#  MAIN API VIEW
# ==============================================================================

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def generate_single_semester_view_api_recieve_send(request):
    """
    1. Receives JSON payload from React.
    2. Transforms and Saves data to DB (Scoped to User).
    3. Generates Solver Config.
    4. Runs Solver.
    5. Returns JSON response with Timetable (Names, not IDs).
    """
    user = request.user
    source_json = request.data    
    start_time = timezone.now()

    # Step 1: Database Import (Atomic to prevent partial saves)
    try:
        with transaction.atomic():
            master_json = transform_frontend_json(source_json)
            semester_obj = import_data(master_json, user)
            
            if not semester_obj:
                return Response(
                    {"detail": "Failed to parse semester structure from input."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
    except Exception as e:
        return Response(
            {"detail": f"Data Import Error: {str(e)}"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    # Step 2: Generate Configuration for Solver
    try:
        config = generate_config_from_models(user=user, semester=semester_obj)
    except Exception as e:
        return Response(
            {"detail": f"Configuration Error: {str(e)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # Step 3: Run the Solver
    solver = TimetableSolver(config)
    success, timetable_result = solver.solve(timeout=30)

    if not success:
        return Response(
            {
                "detail": "Solver failed. Constraints are too tight (e.g., faculty unavailable, not enough slots).",
                "failed_constraints": True
            }, 
            status=status.HTTP_422_UNPROCESSABLE_ENTITY
        )

    # Step 4: Process Output for Frontend (Swap IDs for Names)
    processed_timetable = _process_solver_output(solver, config, timetable_result)

    # Step 5: Save Result
    TimetableResult.objects.create(
        user=user,
        solution_found=True,
        timetable_json=timetable_result, # We save the raw logic (IDs) for consistency
        runtime_seconds=(timezone.now() - start_time).total_seconds()
    )

    # Step 6: Construct Helper Data (Slots & Breaks) for UI
    periods_raw = config.get('settings', {}).get('periods_per_day', [])
    breaks_raw = config.get('settings', {}).get('breaks_after_period', {})
    
    final_slots_list = []
    for i, slot_time in enumerate(periods_raw):
        final_slots_list.append({
            'index': i, 
            'time': slot_time, 
            'type': 'period'
        })
        # Add Break if exists after this period
        # Note: breaks_raw keys are 1-based strings ('1', '2'...)
        if str(i + 1) in breaks_raw:
            final_slots_list.append({
                'index': None, 
                'time': breaks_raw[str(i + 1)], 
                'type': 'break'
            })
    
    # 🔥 FIX: Include 'subjects' and 'faculty' in config for the Legend Table
    return Response({
        'success': True,
        'semester': {'number': semester_obj.number, 'name': semester_obj.name},
        'config': {
            'working_days': config.get('settings', {}).get('working_days', []),
            'slots_and_breaks': final_slots_list,
            'subjects': config['subjects'], 
            'faculty': config['faculty'], 
        },
        'timetable': processed_timetable,
    }, status=status.HTTP_200_OK)


# ==============================================================================
#  HELPER FUNCTIONS (ETL LOGIC)
# ==============================================================================

def transform_frontend_json(source_data):
    """
    Transforms React Payload -> Master JSON format for DB Import.
    Includes fixes for reading explicit Divisions and Partitions.
    """
    target_json = {}

    # 1. Settings
    settings = {}
    settings['working_days'] = [d['fullName'] for d in source_data.get('days', []) if d.get('isWorkingDay')]
    
    periods = []
    breaks = {}
    
    timings = source_data.get('timings', [])
    for i, item in enumerate(timings):
        if item['type'] == 'period':
            periods.append(f"{item['startTime']}-{item['endTime']}")
        elif item['type'] == 'break' and i > 0:
            if timings[i - 1]['type'] == 'period':
                prev_period_num = timings[i - 1]['number']
                breaks[str(prev_period_num)] = f"BREAK ({item['startTime']}-{item['endTime']})"
    
    settings['periods_per_day'] = periods
    settings['breaks_after_period'] = breaks
    target_json['settings'] = settings

    # 2. Faculty (Map Code to Name)
    faculty = {}
    for fac in source_data.get('faculty', []):
        # Use shortName or name as the key
        code = fac.get('shortName') or fac.get('name')
        faculty[code] = {'name': fac['name']}
    target_json['faculty'] = faculty

    # 3. Semester Data
    semester_raw = source_data.get('semester', '')
    semester_key = ''.join(filter(str.isdigit, semester_raw))
    
    if not semester_key:
        semester_key = "1" 

    semester_data = {}
    
    # 4. Divisions & Partitions (🔥 READ FROM 'divisions' ARRAY)
    divisions = {}
    # Use the new explicit divisions list from frontend
    for div_data in source_data.get('divisions', []):
        div_name = div_data.get('name', 'Unknown')
        
        # Get custom partition names (e.g., ["Batch A", "Batch B"])
        # If frontend sends nothing, default to empty list
        partitions = div_data.get('subdivisions', [])
        
        divisions[div_name] = {
            'off_day': "None", 
            'partitions': partitions
        }
    
    semester_data['divisions'] = divisions

    # 5. Subjects
    subjects = {}
    for sub in source_data.get('subjects', []):
        # Use ShortName provided by user, else Name.
        code = sub.get('shortName') or sub.get('name')
        subjects[code] = {
            'name': sub['name'],
            'lectures': sub.get('lecturesPerWeek', 0),
            'labs': sub.get('labsPerWeek', 0),
            'double_periods': 1 if sub.get('isDoubleSlot') else 0
        }
    semester_data['subjects'] = subjects

    # 6. Faculty Assignments
    faculty_assignments = defaultdict(dict)
    assigned_pairs = set()
    
    for fac in source_data.get('faculty', []):
        fac_code = fac.get('shortName') or fac.get('name')
        
        for sub_name in fac.get('assignedSubjects', []):
            # sub_name is now "Cloud Computing" (or shortname), NOT an ID
            for div_code in divisions.keys():
                if (sub_name, div_code) not in assigned_pairs:
                    faculty_assignments[sub_name][div_code] = fac_code
                    assigned_pairs.add((sub_name, div_code))
    
    semester_data['faculty_assignments'] = dict(faculty_assignments)
    target_json[semester_key] = semester_data

    return target_json


def import_data(master_json, user):
    """
    Saves transformed JSON to Django Models (Scoped to User).
    """
    # Clear existing data for this user to avoid conflicts/stale data
    Setting.objects.filter(user=user).delete()
    FacultyAssignment.objects.filter(user=user).delete()
    Division.objects.filter(user=user).delete()
    Subject.objects.filter(user=user).delete()
    Semester.objects.filter(user=user).delete()
    Faculty.objects.filter(user=user).delete()

    # 1. Shared Settings
    for key, value in master_json.get("settings", {}).items():
        Setting.objects.create(user=user, key=key, value=value)
    
    # 2. Shared Faculty
    for code, details in master_json.get("faculty", {}).items():
        Faculty.objects.create(user=user, code=code, name=details["name"])

    # 3. Semester Blocks
    latest_semester = None
    for key, semester_data in master_json.items():
        if key.isdigit():
            semester_num = int(key)
            semester_obj = Semester.objects.create(
                user=user,
                number=semester_num,
                name=f"Semester {semester_num}"
            )
            latest_semester = semester_obj

            # Subjects
            for code, details in semester_data.get("subjects", {}).items():
                Subject.objects.create(
                    user=user, 
                    code=code, 
                    name=details['name'],
                    lectures=details['lectures'],
                    labs=details['labs'],
                    double_periods=details['double_periods'],
                    semester=semester_obj
                )

            # Divisions
            for code, details in semester_data.get("divisions", {}).items():
                partitions_str = ",".join(details.get("partitions", []))
                Division.objects.create(
                    user=user,
                    code=code,
                    name=f"{code} Division",
                    off_day=details.get("off_day"),
                    partitions=partitions_str,
                    semester=semester_obj
                )

            # Assignments
            for sub_code, assignments in semester_data.get("faculty_assignments", {}).items():
                try:
                    subject_obj = Subject.objects.get(user=user, code=sub_code, semester=semester_obj)
                    for div_code, fac_code in assignments.items():
                        division_obj = Division.objects.get(user=user, code=div_code, semester=semester_obj)
                        faculty_obj = Faculty.objects.get(user=user, code=fac_code)
                        
                        FacultyAssignment.objects.create(
                            user=user,
                            subject=subject_obj,
                            division=division_obj,
                            faculty=faculty_obj
                        )
                except Exception as e:
                    print(f"Assignment skipped error: {e}")
                    continue

    return latest_semester


def generate_config_from_models(user, semester, existing_faculty_schedule=None):
    """
    Prepares the dictionary required by TimetableSolver class.
    """
    if existing_faculty_schedule is None:
        existing_faculty_schedule = set()

    config = {
        'settings': {},
        'divisions': {},
        'subjects': {},
        'faculty': {},
        'faculty_assignments': defaultdict(dict),
        'faculty_unavailability': set()
    }

    # Settings
    settings_qs = Setting.objects.filter(user=user)
    config['settings'] = {s.key: s.value for s in settings_qs}

    # Faculty
    faculties = Faculty.objects.filter(user=user)
    config['faculty'] = {f.code: {'name': f.name} for f in faculties}

    # Faculty Unavailability (Constraints)
    availabilities = FacultyAvailability.objects.filter(user=user).select_related('faculty')
    for avail in availabilities:
        for i in range(1, 10):
            is_available = getattr(avail, f'slot_{i}', True)
            if not is_available:
                config['faculty_unavailability'].add(
                    (avail.faculty.code, avail.day, i - 1)
                )
    
    config['faculty_unavailability'].update(existing_faculty_schedule)

    # Semester Data
    if semester:
        divisions = Division.objects.filter(user=user, semester=semester)
        subjects = Subject.objects.filter(user=user, semester=semester)
        assignments = FacultyAssignment.objects.filter(user=user, subject__semester=semester)

        for div in divisions:
            config['divisions'][div.code] = {
                'off_day': div.off_day,
                'partitions': div.get_partitions_list()
            }
        
        for sub in subjects:
            config['subjects'][sub.code] = {
                'name': sub.name,
                'lectures': sub.lectures,
                'labs': sub.labs,
                'double_periods': sub.double_periods
            }

        for assign in assignments:
            config['faculty_assignments'][assign.subject.code][assign.division.code] = assign.faculty.code

    return config


# ==============================================================================
#  PROCESS SOLVER OUTPUT (ID -> NAME SWAP)
# ==============================================================================

def _process_solver_output(solver, config, raw_timetable_data):
    """
    CONVERTS IDs TO NAMES.
    Ensures the frontend receives readable names (e.g. "Cloud Computing") 
    instead of internal IDs (e.g. "1767873372880").
    """
    processed_data = {}
    periods_count = len(config['settings'].get('periods_per_day', []))
    working_days = config['settings'].get('working_days', [])

    # 1. Create Lookup Maps (ID -> Name)
    subject_map = {code: details['name'] for code, details in config['subjects'].items()}
    faculty_map = {code: details['name'] for code, details in config['faculty'].items()}

    for div_code, raw_days in raw_timetable_data.items():
        div_schedule = []
        off_day = config['divisions'].get(div_code, {}).get('off_day')

        for day in working_days:
            # Case 1: Off Day
            if day == off_day:
                div_schedule.append({
                    'name': day,
                    'is_offday': True,
                    'slots': [{'type': 'OffDay'}] * periods_count
                })
                continue

            # Case 2: Working Day
            raw_slots = raw_days.get(day, [None] * periods_count)
            final_slots = []
            i = 0

            while i < len(raw_slots):
                cell = raw_slots[i]
                
                # --- EMPTY SLOT ---
                if cell is None:
                    final_slots.append(None)
                    i += 1
                    continue
                
                # --- PLACEHOLDER (Merged Cell) ---
                if isinstance(cell, dict) and cell.get('type') == 'Placeholder':
                    final_slots.append({'type': 'Placeholder'})
                    i += 1
                    continue

                # --- DETECT TYPES ---
                is_double = (
                    isinstance(cell, dict) and 
                    cell.get('subject') and 
                    i + 1 < len(raw_slots) and 
                    cell == raw_slots[i+1]
                )
                is_lab = isinstance(cell, list)

                # --- PROCESSING LOGIC ---
                if is_double:
                    entry = cell.copy()
                    entry['type'] = 'DoubleLec'
                    
                    # 🔥 SWAP ID FOR NAME
                    raw_sub_id = entry['subject']
                    entry['subject'] = subject_map.get(raw_sub_id, raw_sub_id) 

                    # 🔥 SWAP ID FOR NAME
                    raw_fac_id = solver._get_faculty(div_code, raw_sub_id, 'lecture')
                    entry['faculty'] = faculty_map.get(raw_fac_id, raw_fac_id)

                    final_slots.append(entry)
                    final_slots.append({'type': 'Placeholder'})
                    i += 2
                
                elif is_lab:
                    # Labs are a list of dicts: [{'lab': 'SubID', 'faculty': 'FacID', ...}, ...]
                    clean_lab_details = []
                    for lab_item in cell:
                        clean_item = {}
                        
                        # 🔥 SWAP SUBJECT ID FOR NAME (In solver, 'lab' key holds Subject ID)
                        raw_sub_id = lab_item['lab'] 
                        clean_item['subject'] = subject_map.get(raw_sub_id, raw_sub_id)
                        
                        # 🔥 SWAP FACULTY ID FOR NAME
                        raw_fac_id = lab_item['faculty']
                        clean_item['faculty'] = faculty_map.get(raw_fac_id, raw_fac_id)
                        
                        # Keep partition info (e.g., "A1")
                        clean_item['partition'] = lab_item.get('partition', '')
                        
                        clean_lab_details.append(clean_item)

                    final_slots.append({'type': 'LabBlock', 'details': clean_lab_details})
                    final_slots.append({'type': 'Placeholder'})
                    i += 2
                
                elif isinstance(cell, dict): # Single Lecture
                    entry = cell.copy()
                    entry['type'] = 'Lec'
                    
                    # 🔥 SWAP ID FOR NAME
                    raw_sub_id = entry['subject']
                    entry['subject'] = subject_map.get(raw_sub_id, raw_sub_id)
                    
                    # 🔥 SWAP ID FOR NAME
                    raw_fac_id = solver._get_faculty(div_code, raw_sub_id, 'lecture')
                    entry['faculty'] = faculty_map.get(raw_fac_id, raw_fac_id)

                    final_slots.append(entry)
                    i += 1
                else:
                    final_slots.append(None)
                    i += 1

            div_schedule.append({
                'name': day,
                'is_offday': False,
                'slots': final_slots
            })

        processed_data[div_code] = div_schedule

    return processed_data