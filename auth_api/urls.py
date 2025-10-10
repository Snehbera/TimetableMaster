# auth_api/urls.py

from django.urls import path, include

urlpatterns = [
    # Login, Logout, User Details (using rest_auth)
    # /api/auth/login/
    # /api/auth/logout/
    # /api/auth/user/
    path('', include('rest_auth.urls')),        
    
    # Registration/Sign-up (using rest_auth.registration)
    # /api/auth/register/
    path('register/', include('rest_auth.registration.urls')),

    # You can add a path here to check authentication status
    # path('status/', views.AuthStatusView.as_view(), name='auth_status'),
]