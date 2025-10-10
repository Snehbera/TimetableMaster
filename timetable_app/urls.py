# timetable_app/urls.py (The app's urls.py)

from django.urls import path
from . import views

urlpatterns = [
    # path('generate/', views.generate_single_semester_view, name='generate_timetable'), 
    path('generate-semester/<int:semester_id>/', views.generate_single_semester_view, name='generate_single_semester'),
    path('generate-department/', views.generate_department_timetable_view, name='generate_department'),
    path('generate-semester-api/<int:semester_id>/', views.generate_single_semester_view_api_send, name='generate_single_semester'),
    path('r/generate-semester-api/', views.generate_single_semester_view_api_recieve_send, name='generate_single_semester'),


    path('history/', views.list_timetables, name='list_timetables'),
    
    # Page to view a specific saved timetable
    path('history/view/<int:pk>/', views.view_timetable_detail, name='view_timetable_detail'),

]