from django.shortcuts import render

# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json # Import the json library

class TimetableSolverView(APIView):
    """
    API View to receive timetable data and return a generated solution.
    """
    def post(self, request, *args, **kwargs):
        # request.data contains the parsed JSON from the React frontend
        timetable_data = request.data

        # --- THIS IS WHERE YOUR SOLVER LOGIC GOES ---
        # For now, we'll just print the data to the console to confirm we received it.
        print("✅ Received Timetable Data from React:")
        print(json.dumps(timetable_data, indent=2)) # Pretty print the JSON

        # --- SIMULATE A SOLVER ---
        # In a real application, you would pass 'timetable_data' to your
        # constraint satisfaction solver or optimization algorithm.
        # Here, we'll just return a dummy success message and a sample result.

        dummy_generated_timetable = {
            "status": "success",
            "message": "Timetable generated successfully!",
            "timetableId": "TT-2025-Fall-CSE",
            "generatedAt": "2025-10-07T19:30:00Z",
            "solution": [
                {"day": "Monday", "period": 1, "class": "CSE-A", "subject": "Data Structures", "faculty": "Dr. Alan", "room": "CR-101"},
                {"day": "Monday", "period": 2, "class": "CSE-B", "subject": "Algorithms", "faculty": "Dr. Turing", "room": "CR-102"},
                # ... more periods
            ]
        }

        return Response(dummy_generated_timetable, status=status.HTTP_200_OK)