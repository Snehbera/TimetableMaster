# timetable_app/urls.py (The app's urls.py)

from django.urls import path
from . import views

urlpatterns = [
    # For Recieving Data and sending data from Frontend(react)
    path('r/generate-semester-api/', views.generate_single_semester_view_api_recieve_send, name='generate_single_semester'),

    # Seeing history of timetable generation
    path('history/', views.list_timetables, name='list_timetables'),
    
    # Page to view a specific saved timetable
    path('history/view/<int:pk>/', views.view_timetable_detail, name='view_timetable_detail'),

]