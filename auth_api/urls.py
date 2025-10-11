# auth_api/urls.py (No changes needed, keeping existing code)

from django.urls import path
from .views import RegisterView, LoginView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='json_register'),
    path('login/', LoginView.as_view(), name='json_login'),
]