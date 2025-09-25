# timetable_app/models.py

from django.db import models

class Setting(models.Model):
    key = models.CharField(max_length=50, unique=True)
    value = models.JSONField()

    def __str__(self):
        return self.key

class Faculty(models.Model):
    code = models.CharField(max_length=5, unique=True, primary_key=True)
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.code} - {self.name}"

class Subject(models.Model):
    code = models.CharField(max_length=10, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    lectures = models.IntegerField(default=0)
    labs = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.code} ({self.lectures}L, {self.labs}Lab)"

class Division(models.Model):
    code = models.CharField(max_length=10, unique=True, primary_key=True)
    off_day = models.CharField(max_length=15)
    # Partitions are stored as a comma-separated string, e.g., "BX1,BX2"
    partitions = models.CharField(max_length=100, help_text="Comma-separated partition codes (e.g., A,B)")

    def get_partitions_list(self):
        return [p.strip() for p in self.partitions.split(',')] if self.partitions else []

    def __str__(self):
        return f"Division {self.code}"

class FacultyAssignment(models.Model):
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
    generation_time = models.DateTimeField(auto_now_add=True)
    solution_found = models.BooleanField(default=False)
    # The actual timetable data stored as JSON
    timetable_json = models.JSONField(null=True, blank=True)
    runtime_seconds = models.FloatField(default=0.0)

    def __str__(self):
        return f"Timetable Result ({'Success' if self.solution_found else 'Failed'}) at {self.generation_time.strftime('%Y-%m-%d %H:%M')}"