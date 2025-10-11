# timetable_app/views.py

from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from django.utils import timezone
from collections import defaultdict
import json
from .helper_views import _process_solver_output
from .timetablegenerator_django import TimetableSolver
from django.contrib.auth import get_user_model

from requests import Response
from django.db import transaction  # For safe database operations
# DRF Imports for the API view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import TokenAuthentication 
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

# Your models and solver
from .models import Semester, Subject, Division, Faculty, FacultyAssignment, Setting, TimetableResult
from .timetablegenerator_django import TimetableSolver
from .helper_views import *



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
    success, timetable_result = solver.solve(30) 

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
def generate_single_semester_view_api_send(request, semester_id):
    """
    Generates a timetable and returns a clean, efficient JSON response for React.
    (This function is now identical to generate_single_semester_view_api_recieve_send)
    """
    try:
        semester = Semester.objects.get(number=semester_id)
    except Semester.DoesNotExist:
        return JsonResponse({'success': False, 'error': f'Semester with number {semester_id} not found.'}, status=404)

    start_time = timezone.now()
    config = generate_config_from_models(semester)
    
    if not config.get('divisions') or not config.get('subjects'):
        return JsonResponse({'success': False, 'error': f"Configuration for {semester.name} is incomplete."}, status=400)

    solver = TimetableSolver(config)
    success, timetable_result = solver.solve(30)

    if not success:
        return JsonResponse({'success': False, 'error': f"Failed to generate for {semester.name}. Constraints too tight."}, status=422)

    raw_timetable_data = {div: dict(days) for div, days in timetable_result.items()}
    processed_timetable = _process_solver_output(solver, config, raw_timetable_data)
    
    result = TimetableResult.objects.create(
        solution_found=True,
        runtime_seconds=(timezone.now() - start_time).total_seconds(),
        timetable_json=raw_timetable_data
    )
    
    periods_raw = config.get('settings', {}).get('periods_per_day', [])
    breaks_raw = config.get('settings', {}).get('breaks_after_period', {})
    final_slots_list = []
    for i, slot_time in enumerate(periods_raw):
        final_slots_list.append({'index': i, 'time': slot_time, 'type': 'period'})
        if str(i + 1) in breaks_raw:
            final_slots_list.append({'index': None, 'time': breaks_raw[str(i + 1)], 'type': 'break'})
    
    json_response_data = {
        'success': True,
        'semester': {'number': semester.number, 'name': semester.name},
        'timetableId': result.id,
        'runtimeSeconds': result.runtime_seconds,
        'config': {
            'working_days': config.get('settings', {}).get('working_days', []),
            'slots_and_breaks': final_slots_list,
        },
        'timetable': processed_timetable,
    }
    return JsonResponse(json_response_data)

@api_view(['POST'])
# ⭐ CRITICAL FIX: Explicitly set the authentication class
@authentication_classes([TokenAuthentication]) 
@permission_classes([IsAuthenticated]) # This will now check if TokenAuthentication succeeded
@csrf_exempt 
def generate_single_semester_view_api_recieve_send(request): 
    
    source_json_from_react = request.data
    auth_header = request.META.get('HTTP_AUTHORIZATION')
    print(f"--- Received Auth Header: {auth_header} ---") 
    
    # ⭐ CRITICAL FIX: SAFELY DETERMINE USER (Insecure for testing ONLY)
    if request.user.is_authenticated:
        user = request.user
    else:
        # Fallback to the first existing user since your models have NOT NULL constraints
        try:
            user = get_user_model().objects.first() 
            if not user:
                 return Response({"error": "No users exist. Please create an admin user or register first."}, status=500)
        except Exception as e:
            return Response({"error": f"Error accessing user model: {str(e)}"}, status=500)


    # try:
    # --- WORKFLOW STEP 1 & 2: Transform the data and load it into the DB ---
    with transaction.atomic():
        master_json = transform_frontend_json(source_json_from_react)
        
        # ⭐ CRITICAL FIX 1: PASS THE USER OBJECT to import_data
        semester_obj = import_data(master_json, user) 

    if not semester_obj:
        return Response({"error": "No valid semester data could be imported from the provided JSON."}, status=400)

    # --- WORKFLOW STEP 3 & 4: Generate timetable and send response ---
    # ⭐ CRITICAL FIX 2: PASS THE USER OBJECT to generate_config_from_models
    config = generate_config_from_models(user=user, semester=semester_obj) 
    
    if not config.get('divisions') or not config.get('subjects'):
        return Response({'error': f"Configuration for {semester_obj.name} is incomplete after import."}, status=400)

    solver = TimetableSolver(config)
    # Assuming solver.solve() is where timeout=30 should be passed, if needed
    success, timetable_result = solver.solve(15) 

    if not success:
        return Response({'error': f"Data imported, but failed to generate timetable for {semester_obj.name}."}, status=422)

    processed_timetable = _process_solver_output(solver, config, timetable_result)
    
    # ⭐ CRITICAL FIX 3: Ensure TimetableResult creation uses the 'user'
    result = TimetableResult.objects.create(
        user=user, 
        solution_found=True, 
        timetable_json=timetable_result
    )
    
    # Construct and return the final JSON response
    # ... (rest of JSON response construction logic)
    periods_raw = config.get('settings', {}).get('periods_per_day', [])
    breaks_raw = config.get('settings', {}).get('breaks_after_period', {})
    final_slots_list = []
    for i, slot_time in enumerate(periods_raw):
        final_slots_list.append({'index': i, 'time': slot_time, 'type': 'period'})
        if str(i + 1) in breaks_raw:
            final_slots_list.append({'index': None, 'time': breaks_raw[str(i + 1)], 'type': 'break'})
    
    json_response_data = {
        'success': True,
        'semester': {'number': semester_obj.number, 'name': semester_obj.name},
        'timetableId': result.id,
        'config': {
            'working_days': config.get('settings', {}).get('working_days', []),
            'slots_and_breaks': final_slots_list,
        },
        'timetable': processed_timetable,
    }
    return Response(json_response_data)

    # except Exception as e:
    #     return Response({'error': f'A critical error occurred: {str(e)}'}, status=500)



def import_data_from_json(master_json): # Renamed and user parameter removed
    """
    Takes the transformed "master" JSON and saves its data to the
    database. (No longer scoped to a user).
    """
    # Clear all previous timetable data for a clean import
    Setting.objects.all().delete()
    FacultyAssignment.objects.all().delete()
    Division.objects.all().delete()
    Subject.objects.all().delete()
    Semester.objects.all().delete()
    Faculty.objects.all().delete()

    # Load shared data
    for key, value in master_json.get("settings", {}).items():
        Setting.objects.update_or_create(key=key, defaults={"value": value})
    
    for code, details in master_json.get("faculty", {}).items():
        Faculty.objects.update_or_create(code=code, defaults={"name": details["name"]})

    # Process each semester block
    for key, semester_data in master_json.items():
        
            semester_number = int(key)  
            semester_obj, _ = Semester.objects.get_or_create(
                number=semester_number, 
                defaults={'name': f'Semester {semester_number}'}
            )
            
            for code, details in semester_data.get("subjects", {}).items():
                Subject.objects.update_or_create(code=code, defaults={**details, "semester": semester_obj})

            for code, details in semester_data.get("divisions", {}).items():
                partitions_str = ",".join(details.get("partitions", []))
                Division.objects.update_or_create(code=code, defaults={
                    "name": f"{code} Division", "off_day": details.get("off_day"),
                    "partitions": partitions_str, "semester": semester_obj
                })
            
            for subject_code, assignments in semester_data.get("faculty_assignments", {}).items():
                subject_obj = Subject.objects.get(code=subject_code, semester=semester_obj)
                for division_code, faculty_code in assignments.items():
                    division_obj = Division.objects.get(code=division_code, semester=semester_obj)
                    faculty_obj = Faculty.objects.get(code=faculty_code)
                    FacultyAssignment.objects.create(subject=subject_obj, division=division_obj, faculty=faculty_obj)
            
            return semester_obj
    return None
