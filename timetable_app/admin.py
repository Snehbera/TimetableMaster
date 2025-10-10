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
@admin.register(FacultyAvailability)
class FacultyAvailabilityAdmin(admin.ModelAdmin):
    list_display = ('faculty', 'day', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5', 'slot_6')
    list_filter = ('day', 'faculty')
    list_editable = ('slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5', 'slot_6')
    
    # Optional: Add an action to quickly mark a faculty as unavailable for an entire day
    actions = ['make_unavailable_for_day']

    def make_unavailable_for_day(self, request, queryset):
        queryset.update(
            slot_1=False, slot_2=False, slot_3=False, 
            slot_4=False, slot_5=False, slot_6=False
        )
    make_unavailable_for_day.short_description = "Mark selected as unavailable for the entire day"

