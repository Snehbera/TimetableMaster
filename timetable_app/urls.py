# timetable_app/urls.py (The app's urls.py)

from django.urls import path
from . import views

urlpatterns = [
    # path('generate/', views.generate_single_semester_view, name='generate_timetable'), 
    path('generate-semester/<int:semester_id>/', views.generate_single_semester_view, name='generate_single_semester'),
    path('generate-department/', views.generate_department_timetable_view, name='generate_department'),
]
