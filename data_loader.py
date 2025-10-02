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


if __name__ == "__main__":
    json_file_path = "config.json"
    import_data_from_master_json(json_file_path)