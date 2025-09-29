import os
import django
import json

# Set up the Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "prototype.settings")
django.setup()

from timetable_app.models import *
from django.db import IntegrityError



from timetable_app.models import (
    Faculty,
    Subject,
    Division,
    FacultyAssignment,
    TimetableResult
)

def import_data_from_json(file_path):
    """
    Imports data from a JSON file into the specified Django models.
    """
    with open(file_path, 'r') as f:
        data = json.load(f)

    # 1. Clear existing data to prevent duplicates on re-run
    #    (This is an optional but recommended step for development)
    FacultyAssignment.objects.all().delete()
    Division.objects.all().delete()
    Subject.objects.all().delete()
    Faculty.objects.all().delete()
    TimetableResult.objects.all().delete()
    print("Cleaned existing data for specified models...")

    # 2. Load Faculty
    print("Loading Faculty data...")
    for code, details in data["faculty"].items():
        Faculty.objects.get_or_create(code=code, defaults={"name": details["name"]})

    # 3. Load Subjects
    print("Loading Subject data...")
    for code, details in data["subjects"].items():
        Subject.objects.get_or_create(
            code=code,
            defaults={
                "name": details["name"],
                "lectures": details["lectures"],
                "labs": details["labs"],
                "double_periods": details.get("double_periods", 0)
            }
        )
    
    # 4. Load Divisions
    print("Loading Division data...")
    for code, details in data["divisions"].items():
        # Convert the list of partitions to a comma-separated string
        partitions_str = ",".join(details["partitions"])
        Division.objects.get_or_create(
            code=code,
            defaults={
                "off_day": details["off_day"],
                "partitions": partitions_str
            }
        )

    # 5. Load Faculty Assignments
    print("Loading Faculty Assignment data...")
    settings_config = data["settings"]
    Setting.objects.update_or_create(
        key="working_days", defaults={"value": settings_config["working_days"]}
    )
    Setting.objects.update_or_create(
        key="periods_per_day", defaults={"value": settings_config["periods_per_day"]}
    )
    
    # Load breaks_after_period (requires integer keys)
    # The JSON keys are strings, but the solver logic expects ints (period index).
    breaks_data = {int(k): v for k, v in settings_config["breaks_after_period"].items()}
    Setting.objects.update_or_create(
        key="breaks_after_period", defaults={"value": breaks_data}
    )
    print("Loaded Setting data.")

    for subject_code, assignments in data["faculty_assignments"].items():
        try:
            subject_obj = Subject.objects.get(code=subject_code)
            for division_code, faculty_code in assignments.items():
                try:
                    division_obj = Division.objects.get(code=division_code)
                    faculty_obj = Faculty.objects.get(code=faculty_code)
                    FacultyAssignment.objects.get_or_create(
                        subject=subject_obj,
                        division=division_obj,
                        defaults={"faculty": faculty_obj}
                    )
                except (Division.DoesNotExist, Faculty.DoesNotExist) as e:
                    print(f"Skipping assignment for {subject_code} in {division_code}: {e}")
                except IntegrityError:
                    print(f"Skipping duplicate assignment for {subject_code} in {division_code}")

        except Subject.DoesNotExist:
            print(f"Skipping assignments for subject {subject_code}: not found.")

    # 6. TimetableResult (This model is for storing results, so no initial data is loaded from the config file)
    print("TimetableResult model is for storing generated timetables, no initial data imported.")

    print("Data import complete! 🎉")

if __name__ == "__main__":
    json_file_path = "config.json"  # Ensure this path is correct
    import_data_from_json(json_file_path)