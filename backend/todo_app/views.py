from django.shortcuts import render
from django.http import HttpResponse
# DRF
from rest_framework import viewsets, permissions
from .models import Todo
from .serializers import TodoSerializer

# Create your views here.
def home(request):
    return HttpResponse(
        "<h1>Welcome to my website home page !</h1>"
    )

class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all().order_by('-created_at')
    serializer_class = TodoSerializer
    # ⚠️ change permissions for auth.
    permission_classes = [permissions.AllowAny]