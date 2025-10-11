# timetable_app/models.py

from django.db import models
from django.contrib.auth import get_user_model


class Setting(models.Model):
    key = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='settings') 
    value = models.JSONField()

    def __str__(self):
        return self.key
    
# In timetable_app/models.py

class Semester(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='semesters') 
    # --- Define the choices for the number field ---
    SEMESTER_CHOICES = [
        (1, '1st Semester'),
        (2, '2nd Semester'),
        (3, '3rd Semester'),
        (4, '4th Semester'),
        (5, '5th Semester'),
        (6, '6th Semester'),
        (7, '7th Semester'),
        (8, '8th Semester'),
    ]

    # The name field can now be non-unique and editable=False if you want
    name = models.CharField(
        max_length=100, 
        help_text="This will be auto-generated based on the semester number.",
        blank=True # Allows the field to be temporarily empty before we save
    )

    # The number field is now the primary source of truth
    number = models.PositiveSmallIntegerField(
        choices=SEMESTER_CHOICES,
        unique=True, # Ensure you can only create one "5th Semester"
        help_text="Select the semester number"
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # --- This is the new logic ---
        # 1. Get the display name for the chosen number (e.g., if number is 5, this gets '5th Semester')
        self.name = self.get_number_display()
        # 2. Call the original save method to save the object to the database
        super().save(*args, **kwargs)

class Faculty(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='faculties') 
    code = models.CharField(max_length=5, unique=True, primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} - {self.name}"

class FacultyAvailability(models.Model):
    """
    Stores a faculty member's availability for an entire day using
    boolean fields for each slot. True = Available, False = Unavailable.
    """
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE) 
    DAY_CHOICES = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
    ]

    faculty = models.ForeignKey(
        Faculty, 
        on_delete=models.CASCADE, 
        related_name='availability_schedule'
    )
    day = models.CharField(max_length=10, choices=DAY_CHOICES)

    # 6 boolean fields, one for each slot in the day.
    # True means the faculty is available by default.
    slot_1 = models.BooleanField(default=True)
    slot_2 = models.BooleanField(default=True)
    slot_3 = models.BooleanField(default=True)
    slot_4 = models.BooleanField(default=True)
    slot_5 = models.BooleanField(default=True)
    slot_6 = models.BooleanField(default=True)
    slot_7 = models.BooleanField(default=True)
    slot_8 = models.BooleanField(default=True)
    slot_9 = models.BooleanField(default=True)

    class Meta:
        # Ensures a faculty can only have one availability entry per day.
        unique_together = ('faculty', 'day')
        verbose_name_plural = "Faculty Availabilities"

    def __str__(self):
        # Creates a readable summary for the Django admin.
        unavailable_slots = [f"Slot {i}" for i in range(1, 7) if not getattr(self, f'slot_{i}')]
        if not unavailable_slots:
            return f"{self.faculty.name} is fully available on {self.day}"
        return f"{self.faculty.name} on {self.day} is unavailable for: {', '.join(unavailable_slots)}"

class Subject(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='subjects') 
    code = models.CharField(max_length=10, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    lectures = models.IntegerField(default=0)
    labs = models.IntegerField(default=0)
    double_periods = models.IntegerField(default=0)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='subjects', null=True) # <<< ADD THIS LINE

   # Corrected __str__ method
    def __str__(self):
        semester_name = self.semester.name if self.semester else "No Sem"
        return f"{self.code} ({self.lectures}L, {self.labs}Lab, {self.double_periods}DL, {semester_name})"

class Division(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='divisions') 
    name = models.CharField(max_length=100, default="null")
    code = models.CharField(max_length=10, unique=True, primary_key=True)
    off_day = models.CharField(max_length=15)
    partitions = models.CharField(max_length=100, help_text="Comma-separated partition codes (e.g., A,B)")
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='divisions', null=True) # <<< ADD THIS LINE

    def get_partitions_list(self):
        return [p.strip() for p in self.partitions.split(',')] if self.partitions else []
    
    # Corrected __str__ method
    def __str__(self):
        semester_name = self.semester.name if self.semester else "No Semester"
        return f"{self.name} ({semester_name})"


class FacultyAssignment(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE) 
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    division = models.ForeignKey(Division, on_delete=models.CASCADE)
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('subject', 'division')
        verbose_name_plural = "Faculty Assignments"

    def __str__(self):
        return f"{self.subject.code} in {self.division.code} by {self.faculty.code}"

# To hold timetable results
class TimetableResult(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='timetableresults') 
    generation_time = models.DateTimeField(auto_now_add=True)
    solution_found = models.BooleanField(default=False)
    # The actual timetable data stored as JSON
    timetable_json = models.JSONField(null=True, blank=True)
    runtime_seconds = models.FloatField(default=0.0)

    def __str__(self):
        return f"Timetable Result ({'Success' if self.solution_found else 'Failed'}) at {self.generation_time.strftime('%Y-%m-%d %H:%M')}"