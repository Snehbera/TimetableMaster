# timetable_app/views.py

from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from collections import defaultdict
import json

# Make sure to import ALL your required models
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

def generate_config_from_models(semester=None, existing_faculty_schedule=set()):
    config = {
        'settings': {},
        'divisions': {},
        'subjects': {},
        'faculty': {},
        'faculty_assignments': defaultdict(dict),
        'faculty_unavailability': set() # Changed from list to set for efficiency
    }

    # Populate settings
    settings_data = {s.key: s.value for s in Setting.objects.all()}
    config['settings'].update(settings_data)

    # Populate faculty
    config['faculty'] = {f.code: {'name': f.name} for f in Faculty.objects.all()}

    # *** NEW: Fetch and process faculty unavailability ***
    for availability in FacultyAvailability.objects.select_related('faculty'):
        # Iterate through the 6 boolean slot fields
        for i in range(1, 7):
            is_available = getattr(availability, f'slot_{i}')
            # If the slot is False (unavailable), add it to the constraint set
            if not is_available:
                # The tuple format is (faculty_code, day_name, slot_index)
                # Slot index is 0-based (slot_1 -> index 0)
                config['faculty_unavailability'].add(
                    (availability.faculty.code, availability.day, i - 1)
                )

    # Add existing schedules from other semesters (for department-wide generation)
    config['faculty_unavailability'].update(existing_faculty_schedule)

    # If a semester is specified, filter data for it
    if semester:
        divisions = Division.objects.filter(semester=semester)
        subjects = Subject.objects.filter(semester=semester)
        assignments = FacultyAssignment.objects.filter(subject__semester=semester)

        for div in divisions:
            config['divisions'][div.code] = {'off_day': div.off_day, 'partitions': div.get_partitions_list()}
        
        for sub in subjects:
            config['subjects'][sub.code] = {
                'name': sub.name, 'lectures': sub.lectures, 'labs': sub.labs, 'double_periods': sub.double_periods
            }

        for assignment in assignments:
            config['faculty_assignments'][assignment.subject.code][assignment.division.code] = assignment.faculty.code
        
        # Override with complex assignments if they exist for the semester
        setting_key = f"FACULTY_ASSIGNMENTS_{semester.number}"
        try:
            complex_assignments = Setting.objects.get(key=setting_key).value
            config['faculty_assignments'] = complex_assignments
        except Setting.DoesNotExist:
            pass # It's okay if this doesn't exist, we just use the simple model data

    return config

# ==============================================================================
# 3. SINGLE SEMESTER VIEW
# ==============================================================================
# timetable_app/views.py (Inside generate_single_semester_view function)

def generate_single_semester_view(request, semester_id):
    """
    Generates a timetable for only ONE specified semester, converts data 
    for template compatibility, and saves the full result.
    """
    semester = get_object_or_404(Semester, number=semester_id)
    start_time = timezone.now()
    print("stated generating timetable in single semester")

    config = generate_config_from_models(semester)

    print("calling timetablesolver")
    solver = TimetableSolver(config) 
    success, timetable_result = solver.solve() 

    if not success:
        error_message = f"Failed to generate timetable for {semester.name}. The constraints might be too tight."
        return render(request, 'timetable_app/timetable_result.html', {
            'error': error_message,
            'semester': semester,
        })

    # Convert raw solver output to standard dictionary
    raw_timetable_data = {div: dict(days) for div, days in timetable_result.items()}
    
    # --- USE HELPER TO PROCESS DATA ---
    # Assuming _process_solver_output is defined elsewhere in views.py
    template_ready_timetable = _process_solver_output(solver, config, raw_timetable_data)
    
    # --- SAVE AND RENDER ---
    timetable_json_data = json.dumps(raw_timetable_data) # Save the raw data
    
    result = TimetableResult(
        solution_found=True,
        runtime_seconds=(timezone.now() - start_time).total_seconds(),
        timetable_json=timetable_json_data
    )
    print("json data :", timetable_json_data)
    result.save()
    
    # --- FIX: Prepare Slots and Breaks for Template ---
    
    # 1. Get the raw periods and breaks dictionary
    periods_raw = config.get('settings', {}).get('periods_per_day', [])
    breaks_raw = config.get('settings', {}).get('breaks_after_period', {})
    working_days_count = len(config.get('settings', {}).get('working_days', []))
    
    # 2. Create the final list of slots/breaks in order
    final_slots_list = []
    
    for i, slot_time in enumerate(periods_raw):
        # Add the regular period slot
        final_slots_list.append({
            'index': str(i),
            'time': slot_time,
            'type': 'period'
        })
        
        # Check if a break follows this period index (using 1-based index from config)
        if str(i + 1) in breaks_raw:
            final_slots_list.append({
                'index': None, 
                'time': breaks_raw[str(i + 1)],
                'type': 'break'
            })
            
    context = {
        'timetable': template_ready_timetable, 
        'result': result,
        'semester': semester,
        'divisions': dict(config.get('divisions', {})), 
        'working_days': config.get('settings', {}).get('working_days', []),
        
        # --- FIXED CONTEXT VARIABLES ---
        'slots_and_breaks': final_slots_list, 
        'num_working_days': working_days_count,
        'num_rows': len(final_slots_list),
        # --- END FIXED CONTEXT VARIABLES ---
    }

    return render(request, 'timetable_app/timetable_result.html', context)

# ==============================================================================
# 4. DEPARTMENT VIEW
# ==============================================================================

def generate_department_timetable_view(request):
    start_time = timezone.now()
    # Process tightest schedule first: Sem 3 before Sem 5
    all_semesters = Semester.objects.all().order_by('number') 
    
    master_faculty_schedule = set()
    department_timetable = {}
    processed_department_timetable = {}

    for semester in all_semesters:
        config = generate_config_from_models(semester, master_faculty_schedule)
        solver = TimetableSolver(config)
        success, semester_timetable = solver.solve(timeout=30) # FIX: Increased timeout to 120s
        print("*" * 30 , f"\ngenerating for sem : {semester}\n", "*" * 30)

        
        if not success:
            error_message = f"Failed to generate timetable for {semester.name}. Constraints are too tight."
            return render(request, 'timetable_app/timetable_result.html', {'error': error_message, 'semester': semester})

        # --- PROCESS DATA FOR TEMPLATE ---
        raw_timetable_data = {div: dict(days) for div, days in semester_timetable.items()}
        
        processed_semester_timetable = _process_solver_output(solver, config, raw_timetable_data)
        
        # Store both raw (for JSON) and processed (for template/clash check)
        department_timetable[semester.name] = raw_timetable_data 
        processed_department_timetable[semester.name] = processed_semester_timetable
        
        # FIX: Update master_faculty_schedule with newly placed classes
        for div_code, days in department_timetable[semester.name].items():
            print("*" * 30 , f"\ngenerating for div : {div_code}\n", "*" * 30)
            for day, slots in days.items():
                for i, cell in enumerate(slots):
                    if cell is None: continue
                    faculty_in_cell = []
                    
                    if isinstance(cell, dict) and cell.get('subject'):
                        # Using 'lecture' for both Lec and DoubleLec classes when checking cross-semester conflict
                        fac_code = solver._get_faculty(div_code, cell['subject'], 'lecture') 
                        if fac_code: faculty_in_cell.append(fac_code)
                    
                    elif isinstance(cell, list): 
                        faculty_in_cell.extend([item['faculty'] for item in cell])
                        
                    for fac in set(faculty_in_cell):
                        master_faculty_schedule.add((fac, day, i))

    serializable_department_timetable = department_timetable # Use raw data for JSON saving
    
    timetable_json_data = json.dumps(serializable_department_timetable)
    # print("jason ")
    
    result = TimetableResult(
        solution_found=True,
        runtime_seconds=(timezone.now() - start_time).total_seconds(),
        timetable_json=timetable_json_data
    )
    print("TIMABEL :", timetable_json_data)
    result.save()

    context = {
        'department_timetable': processed_department_timetable, # Pass PROCESSED data to template
        'result': result,
    }
    return render(request, 'timetable_app/department_result.html', context)

# ==============================================================================
# 4. *** NEW VIEWS FOR LISTING AND VIEWING SAVED TIMETABLES ***
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
    # Since we don't know which semester this was for, we generate a general config
    config = generate_config_from_models()
    
    # The solver object is needed for _process_solver_output to get faculty names
    # We can initialize a dummy solver with the config
    solver = TimetableSolver(config)
    
    # Load the timetable from the JSON field
    raw_timetable_data = result.timetable_json
    
    # Process the raw data just like we do after generation
    template_ready_timetable = _process_solver_output(solver, config, raw_timetable_data)

    # Prepare context for the template (similar to the generation view)
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
        'is_viewing_saved': True, # Flag to show this is a saved view
        'working_days': config.get('settings', {}).get('working_days', []),
        'slots_and_breaks': final_slots_list,
    }
    
    # We re-use the result template for simplicity
    return render(request, 'timetable_app/timetable_result.html', context)

####################################################################################33
def generate_single_semester_view_api(request, semester_id):
    """
    Generates a timetable for only ONE specified semester, and returns the
    full result as a JSON response.
    """
    try:
        semester = get_object_or_404(Semester, number=semester_id)
    except Exception:
        return JsonResponse({'success': False, 'error': f'Semester ID {semester_id} not found.'}, status=404)

    start_time = timezone.now()
    print("stated generating timetable in single semester")

    # Assuming these functions are correctly imported and defined elsewhere
    config = generate_config_from_models(semester)
    solver = TimetableSolver(config)

    print("calling timetablesolver")
    success, timetable_result = solver.solve()

    # --- Handle Failure ---
    if not success:
        error_message = f"Failed to generate timetable for {semester.name}. The constraints might be too tight."
        # Save failure result (optional)
        TimetableResult.objects.create(
            solution_found=False,
            runtime_seconds=(timezone.now() - start_time).total_seconds(),
            timetable_json=json.dumps({'error': error_message})
        )
        return JsonResponse({
            'success': False,
            'error': error_message,
            'semester_id': semester_id
        }, status=500) # Internal Server Error for generation failure

    # Convert raw solver output to standard dictionary for JSON serialization
    raw_timetable_data = {div: dict(days) for div, days in timetable_result.items()}

    # --- Process Data for Detailed View (if needed in JSON) ---
    # The processed data usually contains more human-readable info (like subject name instead of ID)
    template_ready_timetable = _process_solver_output(solver, config, raw_timetable_data)

    # --- SAVE RESULT ---
    timetable_json_data = json.dumps(raw_timetable_data) # Save the raw data

    result = TimetableResult(
        solution_found=True,
        runtime_seconds=(timezone.now() - start_time).total_seconds(),
        timetable_json=timetable_json_data
    )
    print("json data saved for result ID:", result.id if result.id else 'new object')
    result.save()
    
    # --- Prepare Slots and Breaks for JSON Output ---
    periods_raw = config.get('settings', {}).get('periods_per_day', [])
    breaks_raw = config.get('settings', {}).get('breaks_after_period', {})
    working_days_count = len(config.get('settings', {}).get('working_days', []))

    final_slots_list = []
    for i, slot_time in enumerate(periods_raw):
        # Add the regular period slot
        final_slots_list.append({
            'index': str(i),
            'time': slot_time,
            'type': 'period'
        })

        # Check if a break follows this period index (using 1-based index from config)
        if str(i + 1) in breaks_raw:
            final_slots_list.append({
                'index': None,
                'time': breaks_raw[str(i + 1)],
                'type': 'break'
            })

    # --- Return JSON Response ---
    json_response_data = {
        'success': True,
        'semester': {
            'id': semester.number,
            'name': semester.name, # Assuming your Semester model has a 'name' field
        },
        'timetable_id': result.id, # ID of the saved TimetableResult object
        'runtime_seconds': result.runtime_seconds,
        'config': {
            'divisions': config.get('divisions', {}),
            'working_days': config.get('settings', {}).get('working_days', []),
            'slots_and_breaks': final_slots_list,
            'num_working_days': working_days_count,
            'num_rows': len(final_slots_list),
        },
        # The main generated timetable data, often used for display/API consumption
        'raw_timetable_data': raw_timetable_data, # Use the raw data for minimal API output
        'processed_timetable': template_ready_timetable, # Use the processed data for richer API output
    }

    return JsonResponse(json_response_data)