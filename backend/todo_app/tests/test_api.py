# backend/todo_app/tests/test_api.py
from django.contrib.auth import get_user_model
from todo_app.models import Todo
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
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

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
def test_todo_api_list(api_client, user, todo):
    api_client.force_authenticate(user=user)
    url = reverse("todo-list-list")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_200_OK
    assert response.data[0]["title"] == "Test Todo"

@pytest.mark.django_db
def test_todo_api_create(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse("todo-list-list")
    data = {"title": "API Todo", "description": "API Desc", "done": False}
    response = api_client.post(url, data)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["title"] == "API Todo"

@pytest.mark.django_db
def test_todo_api_update(api_client, user, todo):
    api_client.force_authenticate(user=user)
    url = reverse("todo-list-detail", args=[todo.id])
    data = {"title": "Updated Todo", "description": "Update Desc", "done": True}
    response = api_client.put(url, data)
    assert response.status_code == status.HTTP_200_OK
    assert response.data["title"] == "Updated Todo"
    assert response.data["done"] is True

@pytest.mark.django_db
def test_todo_api_delete(api_client, user, todo):
    api_client.force_authenticate(user=user)
    url = reverse("todo-list-detail", args=[todo.id])
    response = api_client.delete(url)
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Todo.objects.filter(id=todo.id).exists()

@pytest.mark.django_db
def test_todo_api_permission(api_client, todo):
    url = reverse("todo-list-list")
    response = api_client.get(url)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

@pytest.mark.django_db
def test_todo_api_user_filtering(api_client, user, todo, db):
    other_user = User.objects.create_user(
        email="other@example.com", username="otheruser", password="password123"
    )
    Todo.objects.create(title="Other Todo", owner=other_user)
    api_client.force_authenticate(user=user)
    url = reverse("todo-list-list")
    response = api_client.get(url)
    titles = [item["title"] for item in response.data]
    assert "Test Todo" in titles
    assert "Other Todo" not in titles