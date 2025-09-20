# backend/scripts/gen_secret_key.py

from django.core.management.utils import get_random_secret_key
# generate a secret key
print(get_random_secret_key())