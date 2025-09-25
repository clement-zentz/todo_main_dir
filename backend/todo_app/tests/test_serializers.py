# backend/todo_app/tests/test_serializers.py
from todo_app.serializers import TodoSerializer
from todo_app.models import Todo
from django.contrib.auth import get_user_model
import pytest

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="test@example.com", username="testuser", password="testpass"
    )

@pytest.fixture
def todo(user):
    return Todo.objects.create(
        title="Test Todo",
        description="Test Description",
        owner=user
    )

def test_todo_serializer_serialization(todo):
    serializer = TodoSerializer(todo)
    data = serializer.data
    assert data["title"] == "Test Todo"
    assert data["description"] == "Test Description"
    assert data["done"] is False
    assert "created_at" in data
    assert "updated_at" in data

def test_todo_serializer_deserialization(user):
    data = {
        "title": "New Todo",
        "description": "Desc",
        "done": False
    }
    serializer = TodoSerializer(data=data)
    assert serializer.is_valid(), serializer.errors
    todo = serializer.save(owner=user)
    assert todo.title == "New Todo"
    assert todo.owner == user

def test_todo_serializer_read_only_fields(todo):
    serializer = TodoSerializer(todo)
    assert "created_at" in serializer.data
    assert "updated_at" in serializer.data
