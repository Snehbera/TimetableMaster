import json
import os
from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User
# Note: UserProfile model is imported implicitly via its signal on User creation

# Determine the path to users.json, assuming it's in the project root (Backend2)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
JSON_FILE_PATH = os.path.join(BASE_DIR, 'users.json')

class Command(BaseCommand):
    help = 'Loads a single user from users.json into the database using direct model creation.'

    def handle(self, *args, **options):
        # 1. Load Data from users.json
        if not os.path.exists(JSON_FILE_PATH):
            # Fallback to hardcoded data if file is missing (to ensure it runs)
            self.stdout.write(self.style.WARNING(f'Warning: users.json not found at {JSON_FILE_PATH}. Using hardcoded data.'))
            data = {
                "name": "Aryan Sharma", 
                "email": "aryan.sharma@example.com",
                "password": "SecurePassword123",
                "number": "9876543210" 
            }
        else:
            try:
                with open(JSON_FILE_PATH, 'r') as f:
                    data = json.load(f)
            except json.JSONDecodeError:
                raise CommandError('Error: Could not decode users.json. Ensure it is valid JSON.')

        # 2. Check for Existing User
        name = data.get('name')
        if User.objects.filter(username=name).exists():
            self.stdout.write(self.style.WARNING(f'User "{name}" already exists. Skipping creation.'))
            return

        # 3. Create and Save Data
        try:
            # Create the User (create_user hashes the password)
            user = User.objects.create_user(
                username=data['name'],
                email=data['email'],
                password=data['password']
            )
            
            # Your post_save signal in models.py automatically created the UserProfile.
            # We now update that profile with the phone number.
            profile = user.profile 
            profile.phone_number = data['number']
            profile.save()

            self.stdout.write(self.style.SUCCESS(
                f'✅ SUCCESS: User "{user.username}" saved directly to the database.'
            ))
            self.stdout.write(f'   Email: {user.email}, Phone: {profile.phone_number}')

        except Exception as e:
            self.stdout.write(self.style.ERROR(f'❌ CRITICAL ERROR during saving: {e}'))