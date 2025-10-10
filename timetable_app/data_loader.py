from collections import defaultdict
import os
import django
import json

# Set up the Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "prototype.settings")
django.setup()

from timetable_app.models import *

def populate_semester_data(semester_obj, semester_data):
    """Helper function to populate the database for a single semester."""
    
    # This part remains the same, as it correctly clears semester-specific data
    print(f"  - Clearing existing data for {semester_obj.name}...")
    FacultyAssignment.objects.filter(subject__semester=semester_obj).delete()
    Division.objects.filter(semester=semester_obj).delete()
    Subject.objects.filter(semester=semester_obj).delete()

    print(f"  - Loading Subjects for {semester_obj.name}...")
    for code, details in semester_data.get("subjects", {}).items():
        Subject.objects.get_or_create(
            code=code,
            defaults={**details, "semester": semester_obj}
        )

    print(f"  - Loading Divisions for {semester_obj.name}...")
    for code, details in semester_data.get("divisions", {}).items():
        partitions_str = ",".join(details.get("partitions", []))
        Division.objects.get_or_create(
            code=code,
            defaults={
                "name": f"{code} Division",
                "off_day": details.get("off_day"),
                "partitions": partitions_str, 
                "semester": semester_obj
            }
        )
    
    print(f"  - Loading Assignments for {semester_obj.name}...")
    for subject_code, assignments in semester_data.get("faculty_assignments", {}).items():
        try:
            subject_obj = Subject.objects.get(code=subject_code, semester=semester_obj)
            for division_code, faculty_code in assignments.items():
                division_obj = Division.objects.get(code=division_code, semester=semester_obj)
                faculty_obj = Faculty.objects.get(code=faculty_code)
                FacultyAssignment.objects.get_or_create(
                    subject=subject_obj,
                    division=division_obj,
                    defaults={"faculty": faculty_obj}
                )
        except (Subject.DoesNotExist, Division.DoesNotExist, Faculty.DoesNotExist) as e:
            print(f"    - Skipping assignment due to a missing object: {e}")


def import_data_from_master_json(file_path):
    """
    Imports data from a single master JSON file for ALL semesters found within it.
    """
    with open(file_path, 'r') as f:
        data = json.load(f)

    # --- NEW: Clear ALL relevant data first ---
    print("Clearing all existing timetable data...")
    FacultyAssignment.objects.all().delete()
    Division.objects.all().delete()
    Subject.objects.all().delete()
    Semester.objects.all().delete() # Also clears semesters for a true fresh start
    Faculty.objects.all().delete()
    Setting.objects.all().delete()
    print("All existing data cleared.")
    # --- END NEW BLOCK ---

    # 1. Load Shared Data (Settings and Faculty)
    print("\nLoading shared data (Settings and Faculty)...")
    for key, value in data.get("settings", {}).items():
        Setting.objects.update_or_create(key=key, defaults={"value": value})
    
    for code, details in data.get("faculty", {}).items():
        Faculty.objects.get_or_create(code=code, defaults={"name": details["name"]})
    print("Shared data loaded.")

    # 2. Automatically find and process each semester block
    for key, semester_data in data.items():
        if key.isdigit():
            semester_number = int(key)
            print(f"\nProcessing Semester {semester_number}...")
            
            # Since we cleared all semesters, we create a new one here
            semester_obj, _ = Semester.objects.get_or_create(number=semester_number)
            
            # The helper function no longer needs to clear data, but it's safe to leave it
            populate_semester_data(semester_obj, semester_data)

    print("\nData import complete! 🎉")


def transform_timetable_json(source_data):
    """
    Converts the source JSON from your frontend into the config format
    required by the Django TimetableSolver.
    """
    target_json = {}

    # 1. --- Transform Settings ---
    settings = {}
    
    # Get working days
    settings['working_days'] = [
        day['fullName'] for day in source_data['days'] if day.get('isWorkingDay')
    ]

    # Get periods and breaks
    periods = []
    breaks = {}
    for i, item in enumerate(source_data['timings']):
        if item['type'] == 'period':
            periods.append(f"{item['startTime']}-{item['endTime']}")
        elif item['type'] == 'break':
            # Find the period number just before this break
            if i > 0 and source_data['timings'][i-1]['type'] == 'period':
                prev_period_num = source_data['timings'][i-1]['number']
                breaks[str(prev_period_num)] = f"BREAK ({item['startTime']}-{item['endTime']})"
    
    settings['periods_per_day'] = periods
    settings['breaks_after_period'] = breaks
    target_json['settings'] = settings

    # 2. --- Transform Faculty List ---
    faculty = {}
    for fac in source_data['faculty']:
        faculty[fac['shortName']] = {'name': fac['name']}
    target_json['faculty'] = faculty

    # 3. --- Create Semester-Specific Data Block ---
    semester_key = ''.join(filter(str.isdigit, source_data.get('semester', '')))
    if not semester_key:
        raise ValueError("Semester information is missing or invalid.")
        
    semester_data = {}

    # 4. --- Transform Divisions (Inferred from 'rooms') ---
    # This is an assumption because divisions are not explicitly defined.
    divisions = {}
    division_map = {} # Maps full name like "B.tech - BX" to "BX"
    
    # First, find all unique divisions from classrooms
    for room in source_data.get('rooms', []):
        if room['type'] == 'classroom':
            full_name = room['homeRoomFor']['timetableName']
            code = full_name.split(' - ')[-1].strip()
            division_map[full_name] = code
            if code not in divisions:
                divisions[code] = {
                    'off_day': "None", # NOTE: This data is MISSING from your source JSON
                    'partitions': []
                }
    
    # Second, find all partitions for each division
    for room in source_data.get('rooms', []):
         if room['type'] == 'lab':
            full_name = room['homeRoomFor']['timetableName']
            if full_name in division_map:
                code = division_map[full_name]
                # Assuming partitions are based on subIndex
                sub_index = room['homeRoomFor']['subIndex']
                partition_name = f"{code}{sub_index + 1}"
                if partition_name not in divisions[code]['partitions']:
                    divisions[code]['partitions'].append(partition_name)

    semester_data['divisions'] = divisions
    
    # 5. --- Transform Subjects ---
    subjects = {}
    for sub in source_data['subjects']:
        subjects[sub['shortName']] = {
            'name': sub['name'],
            'lectures': sub['lecturesPerWeek'],
            'labs': sub['labsPerWeek'],
            'double_periods': 1 if sub.get('isDoubleSlot') else 0
        }
    semester_data['subjects'] = subjects

    # 6. --- Transform Faculty Assignments ---
    # NOTE: This is the most complex transformation due to data structure differences.
    faculty_assignments = defaultdict(dict)
    assigned_pairs = set() # To track (subject, division) pairs to handle duplicates

    for fac in source_data['faculty']:
        faculty_code = fac['shortName']
        for sub_code in fac['assignedSubjects']:
            # Assumption: Assign this faculty to this subject in ALL divisions
            # where this subject is relevant (i.e., all divisions in this example).
            for div_code in divisions.keys():
                # IMPORTANT: We can only assign ONE faculty.
                # If a subject/division is already assigned, we skip it.
                if (sub_code, div_code) not in assigned_pairs:
                    faculty_assignments[sub_code][div_code] = faculty_code
                    assigned_pairs.add((sub_code, div_code))
    
    semester_data['faculty_assignments'] = dict(faculty_assignments)

    # Add the completed semester block to the main JSON
    target_json[semester_key] = semester_data
    
    return target_json


