# timetable_app/views.py (Final Fixes for Serialization and Data Retrieval)

from django.shortcuts import render
from django.utils import timezone
from .models import Subject, Division, Faculty, FacultyAssignment, Setting, TimetableResult
from .timetablegenerator_django import TimetableSolver
from collections import defaultdict

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
    config['settings']['working_days'] = settings_data.get('working_days', [])
    config['settings']['periods_per_day'] = settings_data.get('periods_per_day', [])
    breaks_data = settings_data.get('breaks_after_period', {})
    if isinstance(breaks_data, dict):
        config['settings']['breaks_after_period'] = {str(k): v for k, v in breaks_data.items()}

    for div in Division.objects.all():
        config['divisions'][div.code] = {
            'off_day': div.off_day,
            'partitions': div.get_partitions_list()
        }

    # Subjects: Retrieve the new 'double_periods' field
    for sub in Subject.objects.all():
        config['subjects'][sub.code] = {
            'name': sub.name,
            'lectures': sub.lectures,
            'labs': sub.labs,
            'double_periods': sub.double_periods # <--- Access the NEW field
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
        # NOTE: This error now should be caught if 'double_periods' is missing from the Subject model
        return render(request, 'timetable_app/timetable_result.html', {'error': f"Error loading configuration: {e}"})

    solver = TimetableSolver(config_data)
    
    start_time = timezone.now()
    solution_found = solver.solve(timeout=60)
    end_time = timezone.now()
    runtime = (end_time - start_time).total_seconds()

    result = TimetableResult(
        solution_found=solution_found,
        runtime_seconds=runtime
    )

    if solution_found:
        # --- 1. Create a Clean, Serialized Timetable Structure for JSON ---
        serializable_timetable = defaultdict(lambda: defaultdict(list))
        
        for div, days in solver.timetable.items():
            for day in solver.working_days:
                if day == solver.off_days.get(div):
                    continue

                slots = solver.timetable[div][day]
                for i, cell in enumerate(slots):
                    
                    if cell is None:
                        serializable_timetable[div][day].append(None)
                        
                    elif isinstance(cell, dict) and cell.get('type') == 'Lec':
                        fac_code = solver._get_faculty(div, cell['subject'])
                        serializable_timetable[div][day].append({
                            'type': 'Lec',
                            'subject': cell['subject'],
                            'faculty': fac_code
                        })
                    
                    # --- DoubleLec: Save only on the START slot ---
                    elif isinstance(cell, dict) and cell.get('type') == 'DoubleLec':
                        if i < solver.slots_per_day - 1 and cell is slots[i+1]:
                            fac_code = solver._get_faculty(div, cell['subject'])
                            serializable_timetable[div][day].append({
                                'type': 'DoubleLec',
                                'subject': cell['subject'],
                                'faculty': fac_code
                            })
                        else:
                            # Second slot
                            serializable_timetable[div][day].append({'type': 'DoubleLecPlaceholder'})
                            
                    # --- Lab Block: Save only on the START slot ---
                    elif isinstance(cell, list) and cell[0].get('partition'):
                        if i < solver.slots_per_day - 1 and cell is slots[i+1]:
                             serializable_timetable[div][day].append({
                                'type': 'LabBlock', 
                                'details': cell
                            })
                        else:
                            # Second slot
                            serializable_timetable[div][day].append({'type': 'LabPlaceholder'})
                            
                    else:
                        serializable_timetable[div][day].append(None)


        # --- 2. Save the Clean Structure to DB ---
        result.timetable_json = {
            'timetable': dict(serializable_timetable),
            'settings': solver.config['settings'],
            'divisions': solver.config['divisions'],
            'faculty_names': {f.code: f.name for f in Faculty.objects.all()},
        }
        
    result.save()

    # --- 3. Prepare Context for Template ---
    context = {
        'result': result,
        'config': solver.config,
    }

    if solution_found:
        context['timetable'] = result.timetable_json['timetable']
        context['settings'] = result.timetable_json['settings']
        context['divisions'] = result.timetable_json['divisions']
        context['working_days'] = result.timetable_json['settings']['working_days']
        context['slots'] = result.timetable_json['settings']['periods_per_day']
        
    return render(request, 'timetable_app/timetable_result.html', context)