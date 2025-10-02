# backend/todo_app/tests/test_serializers.py
from todo_app.serializers import TodoSerializer, RegisterSerializer
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


# ---------- CustomUser ----------
@pytest.mark.django_db
def test_register_serializer_success():
    data = {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "StrongPass123"
    }
    serializer = RegisterSerializer(data=data)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()
    assert user.username == "newuser"
    assert user.email == "newuser@example.com"
    assert user.check_password("StrongPass123")
    # password write_only → pas renvoyé
    assert "password" not in serializer.data

@pytest.mark.django_db
def test_register_serializer_missing_email():
    data = {
        "username": "nouser",
        "password": "StrongPass123"
    }
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert "email" in serializer.errors

@pytest.mark.django_db
def test_register_serializer_missing_username():
    data = {
        "email": "nouser@example.com",
        "password": "StrongPass123"
    }
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert "username" in serializer.errors

@pytest.mark.django_db
def test_register_serializer_duplicate_email():
    User.objects.create_user(email="dup@example.com", username="u1", password="pass12345")
    data = {
        "username": "u2",
        "email": "dup@example.com",
        "password": "Another123"
    }
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert "email" in serializer.errors

@pytest.mark.django_db
def test_register_serializer_duplicate_username():
    User.objects.create_user(email="x1@example.com", username="sameuser", password="pass12345")
    data = {
        "username": "sameuser",
        "email": "x2@example.com",
        "password": "Another123"
    }
    serializer = RegisterSerializer(data=data)
    assert not serializer.is_valid()
    assert "username" in serializer.errors

@pytest.mark.django_db
def test_register_serializer_password_hashed():
    raw = "StrongPass123"
    data = {
        "username": "hashu",
        "email": "hash@example.com",
        "password": raw
    }
    serializer = RegisterSerializer(data=data)
    assert serializer.is_valid(), serializer.errors
    user = serializer.save()
    assert user.password != raw
    assert user.check_password(raw)
