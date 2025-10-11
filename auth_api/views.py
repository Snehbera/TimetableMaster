# auth_api/views.py

from multiprocessing.managers import Token
from rest_framework import generics
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import CustomRegistrationSerializer, LoginSerializer
from django.contrib.auth import authenticate, login, get_user_model
from rest_framework.authtoken.models import Token

# 1. Custom Register View (Uses DRF's standard CreateAPIView)
class RegisterView(generics.CreateAPIView):
    # This view is designed to handle POST requests for creating a new instance.
    
    # 1. Use your custom serializer, which has the specific save logic.
    serializer_class = CustomRegistrationSerializer
    
    # 2. Allow anyone to access this endpoint (standard for registration).
    permission_classes = [AllowAny]
    
    # Optional: Customize the response message upon successful creation
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Call the save() method defined in CustomRegistrationSerializer
        self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"detail": "User registered successfully."},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

# 2. Placeholder for LoginView 
# Since you're not using rest-auth's full stack, this needs to be a standard DRF View.
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer # <-- Use the new serializer
   

    def post(self, request, *args, **kwargs):
        # 1. Validate incoming data (email and password format)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        print(request.data)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        # CRITICAL FIX: Django's authenticate() needs a username, not email.
        # We must find the username associated with the provided email.
        try:
            user_obj = get_user_model().objects.get(email=email)
            username = user_obj.username
        except get_user_model().DoesNotExist:
            # If email doesn't exist, treat it as an authentication failure.
            return Response({
                    "detail": "Authentication failed. Invalid email or password.",
                    "is_success": False,
                    },
                    status=status.HTTP_401_UNAUTHORIZED
            )
            
        # 2. Authenticate user credentials
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # 3. Success: Log the user in (sets session)
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            print("token key:",token.key)
            
            # You can also return a token if you switch to TokenAuthentication/JWT
            return Response({
                "detail": "Login successful.",
                "is_success": True,
                "token": token.key
            })
        else:
            # 4. Failure: Invalid credentials
            return Response({
                "detail": "Authentication failed. Invalid email or password.",
                 "is_success": False
                 },
                status=status.HTTP_401_UNAUTHORIZED
            )

# 3. Placeholder for AuthStatusVie