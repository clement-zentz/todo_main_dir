# backend/todo_app/tests/test_models.py
import pytest
from django.contrib.auth import get_user_model
from todo_app.models import Todo

User = get_user_model()

@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="test@example.com", username="testuser", password="testpass"
    )

@pytest.fixture
def todo(user):
    return Todo.objects.create(
        title="Test todo",
        description="Test Description",
        owner=user
    )

@pytest.mark.django_db
def test_todo_model_str(todo):
    assert str(todo) == "Test todo"

@pytest.mark.django_db
def test_todo_model_owner(todo, user):
    assert todo.owner == user

@pytest.mark.django_db
def test_custom_user_model_str(user):
    assert str(user) == "testuser"

@pytest.mark.django_db
def test_custom_user_required_fields(db):
    user = User.objects.create_user(
        email="another@example.com", username="anotheruser", password="pass"
    )
    assert user.email == "another@example.com"
    assert user.username == "anotheruser"