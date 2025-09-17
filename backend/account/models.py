from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    avatar = models.ImageField(
        upload_to="avatars/", 
        blank=True, 
        null=True,
        default="https://www.svgrepo.com/show/452030/avatar-default.svg"
    )
    def __str__(self):
        return self.username
