# timetable_app/urls.py (The app's urls.py)

from django.urls import path
from . import views

urlpatterns = [
    # This URL will be accessed as /timetable/generate/
    path('generate/', views.generate_timetable_view, name='generate_timetable'), 
]