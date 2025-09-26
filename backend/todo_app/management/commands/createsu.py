# backend/todo_app/management/commands/createsu.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import transaction
from dotenv import load_dotenv
from pathlib import Path
import os

class Command(BaseCommand):
    help = "Create superuser with env variables."

    def handle(self, *args, **options):
        env_path = Path(__file__).resolve().parent.parent / ".dev.env"
        print(f"env_path")
        load_dotenv(env_path)

        User = get_user_model()
        username = os.getenv('SU_USERNAME')
        email = os.getenv('SU_EMAIL')
        password = os.getenv('SU_PASSWORD')

        if not all([username, email, password]):
            self.stdout.write(
                self.style.ERROR('Env variables undefined')
            )
            return

        try:
            with transaction.atomic():
                if User.objects.filter(username=username).exists():
                    self.stdout.write(
                        self.style.WARNING(f'The superuser {username} already exist.')
                    )
                    return
                
                User.objects.create_superuser(
                    username=username,
                    email=email,
                    password=password
                )
                self.stdout.write(
                    self.style.SUCCESS(f'Superuser {username} successfully created!')
                )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error during superuser creation : {e}')
            )
            raise