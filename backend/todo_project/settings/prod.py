# backend/todo_project/settings/prod.py
from .base import *
import os

DEBUG = False

def split_env_list(name: str) -> list[str]:
    return [item.strip() for item in os.getenv(name, "").split(",") if item.strip()]

ALLOWED_HOSTS = split_env_list("ALLOWED_HOSTS") or ["localhost"]
CORS_ALLOWED_ORIGINS = split_env_list("CORS_ALLOWED_ORIGINS")
CSRF_TRUSTED_ORIGINS = split_env_list("CSRF_TRUSTED_ORIGINS")

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB'),
        'USER': os.environ.get('POSTGRES_USER'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
        'HOST': os.environ.get('DATABASE_HOST'),
        'PORT': os.environ.get('DATABASE_PORT'),
    }
}