# auth_api/models.py

from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

# --- User Profile Model (Updated to include faculty_id) ---
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    # ⭐ ADDED: Field for the unique faculty ID
    faculty_id = models.CharField(max_length=30, unique=True, blank=True, null=True) 

    def __str__(self):
        return f'{self.user.username} Profile'

# --- Signal to Create Token and Profile on User Creation ---
@receiver(post_save, sender=User)
def create_user_related_objects(sender, instance, created, **kwargs):
    if created:
        # NOTE: This token is not used by your custom JSON auth but is required 
        # by DRF/Django conventions.
        Token.objects.create(user=instance)
        # ⭐ Updated to include the new faculty_id field if needed later
        UserProfile.objects.create(user=instance)