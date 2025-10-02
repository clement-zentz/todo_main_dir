from rest_framework import serializers
from .models import Todo
from django.contrib.auth import get_user_model

User = get_user_model()

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = [
            'id', 'title', 'description', 
            'done', 'created_at', 'updated_at'
        ]
        read_only_field = ["id", "created_at", "updated_at"]
        # The user field is auto-populated, not editable via the API.
        extra_kwargs = {
            'user': {'read_only': True}
        }


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email"),
            password=validated_data["password"]
        )
        return user