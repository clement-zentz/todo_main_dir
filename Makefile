# Makefile

up:
\tdocker-compose up --build

down:
\tdocker-compose down

migrate:
\tdocker-compose exec backend python manage.py migrate

superuser:
\tdocker-compose exec backend python manage.py createsuperuser