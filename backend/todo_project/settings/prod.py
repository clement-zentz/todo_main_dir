# backend/todo_project/settings/prod.py
from .base import *
import os

DEBUG = False

ALLOWED_HOSTS = [
    os.environ.get('DOMAIN'),
    f"www.{os.environ.get('DOMAIN')}",
]

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