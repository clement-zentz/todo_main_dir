# backend/todo_app/tests/test_jwt.py
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
def test_jwt_login(api_client, user):
    url = reverse("token_obtain_pair")
    response = api_client.post(url, {"email": user.email, "password": "testpass"})
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    assert "refresh" in response.data

@pytest.mark.django_db
def test_jwt_refresh(api_client, user):
    login_url = reverse("token_obtain_pair")
    refresh_url = reverse("token_refresh")
    login_resp = api_client.post(login_url, {"email": user.email, "password": "testpass"})
    refresh_token = login_resp.data["refresh"]
    response = api_client.post(refresh_url, {"refresh": refresh_token})
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data

@pytest.mark.django_db
def test_jwt_verify(api_client, user):
    login_url = reverse("token_obtain_pair")
    verify_url = reverse("token_verify")
    login_resp = api_client.post(login_url, {"email": user.email, "password": "testpass"})
    access_token = login_resp.data["access"]
    response = api_client.post(verify_url, {"token": access_token})
    assert response.status_code == status.HTTP_200_OK
