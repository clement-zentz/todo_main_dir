# backend/todo_app/tests/test_models.py
import pytest
from django.contrib.auth import get_user_model, authenticate
from todo_app.models import Todo
from django.db import IntegrityError, transaction

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

# ---------- CustomUser ----------

@pytest.mark.django_db
def test_user_username_field_is_email():
    assert User.USERNAME_FIELD == "email"
    assert "username" in User.REQUIRED_FIELDS

@pytest.mark.django_db
def test_create_user_password_hashed():
    user = User.objects.create_user(
        email="hash@example.com", username="hashuser", password="StrongPass123"
    )
    assert user.password != "StrongPass123"
    assert user.check_password("StrongPass123")

@pytest.mark.django_db
def test_email_uniqueness():
    User.objects.create_user(email="unique@example.com", username="u1", password="pass")
    with pytest.raises(IntegrityError):
        with transaction.atomic():
            User.objects.create_user(email="unique@example.com", username="u2", password="pass")

@pytest.mark.django_db
def test_authenticate_with_email():
    User.objects.create_user(email="login@example.com", username="loginuser", password="LoginPass123")
    user = authenticate(email="login@example.com", password="LoginPass123")
    assert user is not None
    assert user.email == "login@example.com"

@pytest.mark.django_db
def test_optional_fields_defaults():
    user = User.objects.create_user(email="opt@example.com", username="optuser", password="pass")
    assert user.phone_number == ""
    assert user.avatar.name in (None, "")
    assert user.is_premium is False

@pytest.mark.django_db
def test_set_optional_fields():
    user = User.objects.create_user(
        email="full@example.com",
        username="fulluser",
        password="pass",
        phone_number="123456789",
        is_premium=True
    )
    assert user.phone_number == "123456789"
    assert user.is_premium is True

@pytest.mark.django_db
def test_create_superuser_flags():
    admin = User.objects.create_superuser(
        email="admin@example.com",
        username="adminuser",
        password="AdminPass123"
    )
    assert admin.is_staff is True
    assert admin.is_superuser is True

@pytest.mark.django_db
def test_str_returns_username():
    user = User.objects.create_user(email="repr@example.com", username="repruser", password="pass")
    assert str(user) == "repruser"