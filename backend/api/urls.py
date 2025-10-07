# api/urls.py (create this file)
from django.urls import path
from .views import TimetableSolverView

urlpatterns = [
    # This URL will be http://localhost:8000/api/generate/
    path('generate/', TimetableSolverView.as_view(), name='generate-timetable'),
]