# auth_api/serializers.py

from rest_framework import serializers
from django.db import transaction
from django.contrib.auth.models import User 
from .models import UserProfile 

# --- Custom Registration Serializer (Uses ModelSerializer) ---
class CustomRegistrationSerializer(serializers.ModelSerializer):
    # These fields correspond directly to the incoming JSON keys:
    full_name = serializers.CharField(max_length=150, write_only=True)  # Maps to User.username
    faculty_id = serializers.CharField(max_length=30, write_only=True) # Maps to UserProfile.faculty_id
    email = serializers.EmailField(required=True)                      # Maps to User.email
    phone = serializers.CharField(max_length=15, required=False, write_only=True) # Maps to UserProfile.phone_number
    password = serializers.CharField(write_only=True)                   # Maps to User.password

    class Meta:
        model = User
        # Include all fields we expect in the request
        fields = ('full_name', 'faculty_id', 'email', 'phone', 'password') 
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate_email(self, value):
        # Ensure email is unique
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value
        
    def validate_faculty_id(self, value):
        # Ensure faculty_id is unique
        if UserProfile.objects.filter(faculty_id=value).exists():
            raise serializers.ValidationError("A user with that faculty ID already exists.")
        return value


    @transaction.atomic
    def create(self, validated_data):
        # 1. Create the User (and hash the password)
        user = User.objects.create_user(
            # Use 'full_name' for the User's built-in 'username' field
            username=validated_data['full_name'], 
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # NOTE: Your post_save signal automatically created the UserProfile here!
        
        # 2. Save the custom data to the UserProfile model
        profile = user.profile 
        
        # Map incoming 'phone' to 'phone_number'
        profile.phone_number = validated_data.get('phone', '')
        
        # Map incoming 'faculty_id'
        profile.faculty_id = validated_data.get('faculty_id')
        
        profile.save()
        
        return user
    
class LoginSerializer(serializers.Serializer):
    # Expect the user to send their username (which is 'full_name' in your register flow)
    # or email, depending on what you want to allow for login.
    # Based on your setup, using 'email' is often more reliable than 'full_name'
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)