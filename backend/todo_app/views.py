from django.shortcuts import render
from django.http import HttpResponse
# DRF
from rest_framework import viewsets, permissions
from .models import Todo
from .serializers import TodoSerializer

def home(request):
    return HttpResponse(
        "<h1>Welcome to my website home page !</h1>"
    )

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by('-created_at')
    serializer_class = TodoSerializer
    # ✅ Only logged in users can access.
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # ✅ Each user only sees their todos.
        return Todo.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        # ✅ Automatically assigns the current user to the created todo.
        serializer.save(owner=self.request.user)