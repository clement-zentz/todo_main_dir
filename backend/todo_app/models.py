# backend/todo_app/models.py
from django.db import models
# Todo
from django.contrib.auth import get_user_model
# CustomUser
from django.contrib.auth.models import AbstractUser

# User = get_user_model()

# Create your models here.
class Todo(models.Model):
    # owner = models.ForeignKey(
    #     User,
    #     on_delete=models.CASCADE,
    #     null=True,
    #     blank=True 
    # )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
    

# class CustomUser(AbstractUser):
#     phone_number = models.CharField(max_length=20, blank=True)
#     avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
#     is_premium = models.BooleanField(default=False)

#     def __str__(self):
#         return self.username