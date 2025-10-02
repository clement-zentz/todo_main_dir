# settings/test.py
from .base import *

# Utiliser SQLite en mémoire pour les tests
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    }
}

# Accélérer les hash passwords pour les tests
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]