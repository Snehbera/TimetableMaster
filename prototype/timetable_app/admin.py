# timetable_app/admin.py

from django.contrib import admin
from .models import (
    Setting, 
    Faculty, 
    Subject, 
    Division, 
    FacultyAssignment, 
    TimetableResult
)

# 1. Basic Model Registration
# This is the minimum required code to make your models appear in the Admin site.
admin.site.register(Setting)
admin.site.register(Faculty)
admin.site.register(Subject)
admin.site.register(Division)
admin.site.register(TimetableResult)


# 2. Advanced Registration for Clarity (Recommended)
# For models with Foreign Keys (like FacultyAssignment), it's useful to customize 
# the Admin display to show more helpful information, like the actual subject and division codes.

@admin.register(FacultyAssignment)
class FacultyAssignmentAdmin(admin.ModelAdmin):
    # What fields to display in the list view (the main table)
    list_display = ('subject', 'division', 'faculty')
    
    # Enable search on these fields
    search_fields = ('subject__code', 'division__code', 'faculty__name')
    
    # Add filters in the right sidebar
    list_filter = ('division', 'faculty')