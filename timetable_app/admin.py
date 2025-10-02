from django.contrib import admin
from .models import *


class FacultyAvailabilityInline(admin.TabularInline):
    model = FacultyAvailability
    extra = 1

@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')
    inlines = [FacultyAvailabilityInline]

@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'off_day', 'semester') # <<< Added 'semester' here
    list_filter = ('semester',)
    list_editable = ('semester',)

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'lectures', 'labs', 'double_periods', 'semester') # <<< Added 'semester' here
    list_filter = ('semester',)
    search_fields = ('name', 'code')

@admin.register(FacultyAssignment)
class FacultyAssignmentAdmin(admin.ModelAdmin):
    list_display = ('subject', 'division', 'faculty')
    list_filter = ('division', 'faculty')

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('name', 'number')

# Simple registrations for models that don't need a custom admin class
admin.site.register(Setting)
admin.site.register(TimetableResult)
admin.site.register(FacultyAvailability)
