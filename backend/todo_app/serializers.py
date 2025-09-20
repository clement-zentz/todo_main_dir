from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = [
            'id', 'title', 'description', 
            'done', 'created_at', 'updated_at'
        ]
        read_only_field = ["id", "created_at", "updated_at"]