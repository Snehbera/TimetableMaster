# auth_api/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# This view is optional, but useful for testing authentication status.
class AuthStatusView(APIView):
    """
    A simple view to test if the token is valid.
    Requires authentication header.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "is_authenticated": True,
            "user_id": request.user.id,
            "username": request.user.username,
        })