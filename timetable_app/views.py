# timetable_app/views.py (Final Fixes for Serialization and Data Retrieval)

from django.shortcuts import render
from django.utils import timezone
from .models import Subject, Division, Faculty, FacultyAssignment, Setting, TimetableResult
from .timetablegenerator_django import TimetableSolver # Make sure this filename is correct
from collections import defaultdict
import json # Import json

# In timetable_app/views.py

from collections import defaultdict
import json
from .models import Subject, Division, Faculty, FacultyAssignment, Setting, TimetableResult
# ... other imports

def generate_config_from_models():
    """Converts Django model data into the format expected by TimetableSolver."""
    config = {
        'settings': {},
        'divisions': {},
        'subjects': {},
        'faculty': {},
        'faculty_assignments': defaultdict(dict)
    }

    settings_data = {s.key: s.value for s in Setting.objects.all()}
    
    # --- NEW, MORE ROBUST PARSING ---
    # This logic now handles values that are already lists OR are strings.

    # Handle 'working_days'
    working_days_val = settings_data.get('working_days')
    if isinstance(working_days_val, str):
        config['settings']['working_days'] = [day.strip() for day in working_days_val.split(',') if day.strip()]
    elif isinstance(working_days_val, list):
        config['settings']['working_days'] = working_days_val # Use the list directly
    else:
        config['settings']['working_days'] = [] # Default to empty list

    # Handle 'periods_per_day'
    periods_val = settings_data.get('periods_per_day')
    if isinstance(periods_val, str):
        config['settings']['periods_per_day'] = [p.strip() for p in periods_val.split(',') if p.strip()]
    elif isinstance(periods_val, list):
        config['settings']['periods_per_day'] = periods_val # Use the list directly
    else:
        config['settings']['periods_per_day'] = [] # Default to empty list

    # Safely load breaks, which could be a dict or a JSON string
    try:
        breaks_data = settings_data.get('breaks_after_period', '{}')
        if isinstance(breaks_data, str):
            breaks_data = json.loads(breaks_data) # Parse if it's a string
        
        if isinstance(breaks_data, dict):
            config['settings']['breaks_after_period'] = {str(k): v for k, v in breaks_data.items()}
        else:
            config['settings']['breaks_after_period'] = {}
            
    except (json.JSONDecodeError, TypeError):
        config['settings']['breaks_after_period'] = {}
    # --- END OF PARSING FIX ---

    for div in Division.objects.all():
        config['divisions'][div.code] = {
            'off_day': div.off_day,
            'partitions': div.get_partitions_list()
        }

    for sub in Subject.objects.all():
        config['subjects'][sub.code] = {
            'name': sub.name,
            'lectures': sub.lectures,
            'labs': sub.labs,
            'double_periods': sub.double_periods
        }

    for fac in Faculty.objects.all():
        config['faculty'][fac.code] = {'name': fac.name}

    for assignment in FacultyAssignment.objects.select_related('subject', 'division', 'faculty'):
        config['faculty_assignments'][assignment.subject.code][assignment.division.code] = assignment.faculty.code

    return config

def generate_timetable_view(request):
    """View to trigger the timetable generation and display results."""
    
    try:
        config_data = generate_config_from_models()
        if not all(key in config_data['settings'] for key in ['working_days', 'periods_per_day']):
            return render(request, 'timetable_app/timetable_result.html', {'error': "Configuration settings are incomplete."})

    except Exception as e:
        return render(request, 'timetable_app/timetable_result.html', {'error': f"Error loading configuration: {e}"})

    solver = TimetableSolver(config_data)
    
    start_time = timezone.now()
    # Note: solver.solve() returns the timetable dictionary, not a boolean
    timetable_result = solver.solve(timeout=60)
    solution_found = bool(timetable_result) # An empty dict is False, a populated one is True
    end_time = timezone.now()
    runtime = (end_time - start_time).total_seconds()

    result = TimetableResult(
        solution_found=solution_found,
        runtime_seconds=runtime
    )

    if solution_found:
        # --- Serialization logic remains the same, it's well-structured ---
        serializable_timetable = defaultdict(lambda: defaultdict(list))
        
        for div, days in timetable_result.items():
            for day, slots in days.items():
                # Correctly handle double-period classes using object identity
                i = 0
                while i < len(slots):
                    cell = slots[i]
                    if cell is None:
                        serializable_timetable[div][day].append(None)
                        i += 1
                        continue

                    # Check if it's a double-period class
                    is_double = i + 1 < len(slots) and cell is slots[i+1]
                    
                    if isinstance(cell, dict): # Lecture or Double Lecture
                        fac_code = solver._get_faculty(div, cell['subject'])
                        entry = {
                            'type': 'DoubleLec' if is_double else 'Lec',
                            'subject': cell['subject'],
                            'faculty': fac_code
                        }
                        serializable_timetable[div][day].append(entry)
                        if is_double:
                            serializable_timetable[div][day].append({'type': 'Placeholder'})
                            i += 2
                        else:
                            i += 1
                    
                    elif isinstance(cell, list): # Lab Block
                        entry = {'type': 'LabBlock', 'details': cell}
                        serializable_timetable[div][day].append(entry)
                        if is_double:
                           serializable_timetable[div][day].append({'type': 'Placeholder'})
                           i += 2
                        else: # Should not happen for labs, but as a safeguard
                           i += 1
        
        result.timetable_json = {
            'timetable': dict(serializable_timetable),
            'settings': solver.config['settings'],
            'divisions': solver.config['divisions'],
            'faculty_names': {f.code: f.name for f in Faculty.objects.all()},
        }
    
    result.save()

    context = {
        'result': result,
        'config': solver.config,
    }

    if solution_found:
        # Unpack the saved JSON data for the template
        json_data = result.timetable_json
        context.update({
            'timetable': json_data.get('timetable'),
            'settings': json_data.get('settings'),
            'divisions': json_data.get('divisions'),
            'working_days': json_data.get('settings', {}).get('working_days'),
            'slots': json_data.get('settings', {}).get('periods_per_day'),
        })
        
    return render(request, 'timetable_app/timetable_result.html', context)