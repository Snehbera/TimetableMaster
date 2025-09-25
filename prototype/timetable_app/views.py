# timetable_app/views.py

from django.shortcuts import render
from django.utils import timezone
from .models import Subject, Division, Faculty, FacultyAssignment, Setting, TimetableResult
from .timetablegenerator_django import TimetableSolver # Assuming you renamed your solver file
from collections import defaultdict  # <--- ADD THIS LINE

def generate_config_from_models():
    """Converts Django model data into the format expected by TimetableSolver."""
    config = {
        'settings': {},
        'divisions': {},
        'subjects': {},
        'faculty': {},
        'faculty_assignments': defaultdict(dict)
    }

    # Settings
    settings_data = {s.key: s.value for s in Setting.objects.all()}
    config['settings']['working_days'] = settings_data.get('working_days', [])
    config['settings']['periods_per_day'] = settings_data.get('periods_per_day', [])
    config['settings']['breaks_after_period'] = settings_data.get('breaks_after_period', {})

    # Divisions
    for div in Division.objects.all():
        config['divisions'][div.code] = {
            'off_day': div.off_day,
            'partitions': div.get_partitions_list()
        }

    # Subjects
    for sub in Subject.objects.all():
        config['subjects'][sub.code] = {
            'name': sub.name,
            'lectures': sub.lectures,
            'labs': sub.labs
        }

    # Faculty
    for fac in Faculty.objects.all():
        config['faculty'][fac.code] = {'name': fac.name}

    # Faculty Assignments
    for assignment in FacultyAssignment.objects.select_related('subject', 'division', 'faculty'):
        config['faculty_assignments'][assignment.subject.code][assignment.division.code] = assignment.faculty.code

    return config

def generate_timetable_view(request):
    """View to trigger the timetable generation and display results."""
    
    # 1. Load Config from DB
    try:
        config_data = generate_config_from_models()
        if not all(key in config_data['settings'] for key in ['working_days', 'periods_per_day']):
            return render(request, 'timetable_app/timetable_result.html', {'error': "Configuration settings are incomplete."})

    except Exception as e:
        return render(request, 'timetable_app/timetable_result.html', {'error': f"Error loading configuration: {e}"})

    # 2. Run Solver
    solver = TimetableSolver(config_data)
    
    start_time = timezone.now()
    solution_found = solver.solve(timeout=60) # Set a reasonable timeout
    end_time = timezone.now()
    runtime = (end_time - start_time).total_seconds()

    # 3. Save Result
    result = TimetableResult(
        solution_found=solution_found,
        runtime_seconds=runtime
    )

    if solution_found:
        # Prepare data for saving and rendering
        # Note: The print_timetable logic is complex to re-implement for web, 
        # so we'll save the raw timetable structure and pass necessary context.
        result.timetable_json = {
            'timetable': solver.timetable, 
            'settings': solver.config['settings'],
            'divisions': solver.config['divisions'],
            'faculty_assignments': solver.faculty_assignments,
            'faculty_names': {f.code: f.name for f in Faculty.objects.all()},
        }
        
    result.save()

    # 4. Render Template
    context = {
        'result': result,
        'config': solver.config,
    }

    if solution_found:
        # Prepare display-friendly context from the stored JSON
        context['timetable'] = result.timetable_json['timetable']
        context['settings'] = result.timetable_json['settings']
        context['divisions'] = result.timetable_json['divisions']
        context['working_days'] = result.timetable_json['settings']['working_days']
        context['slots'] = result.timetable_json['settings']['periods_per_day']
        
    return render(request, 'timetable_app/timetable_result.html', context)