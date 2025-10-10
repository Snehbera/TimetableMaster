# auth_api/models.py

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# --- User Profile Model (for future expansion and clean data linkage) ---
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Placeholder fields (optional, but good for custom registration)
    is_hod = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return f'{self.user.username} Profile'

# --- Signal to Create Token and Profile on User Creation ---

@receiver(post_save, sender=User)
def create_user_related_objects(sender, instance, created, **kwargs):
    if created:
        # Create an Auth Token for API access
        Token.objects.create(user=instance)
        # Create the User Profile
        UserProfile.objects.create(user=instance)

# After saving this file, run:
# python manage.py makemigrations auth_api
# python manage.py migrate