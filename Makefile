# Makefile

up:
	docker compose up --build

restart:
	docker compose restart

down:
	docker compose down

down-v:
	docker compose down -v

migrate:
	docker compose exec backend python manage.py migrate

bash:
	docker compose exec backend bash

superuser:
	docker compose exec backend python manage.py createsu

psql:
	docker compose exec db psql -U $(db_user) -d $(db_name)

