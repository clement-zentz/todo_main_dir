# Makefile

env ?= dev

COMPOSE_FILES = -f docker-compose.yml
ifeq ($(env), dev)
COMPOSE_FILES += -f docker-compose.dev.yml
else ifeq ($(env), prod)
COMPOSE_FILES += -f docker-compose.prod.yml
else
$(error Unknown env '$(env)' (expected dev or prod))
endif

DC = docker compose $(COMPOSE_FILES)

up:
	$(DC) up --build

build:
	$(DC) build -nocache

restart:
	$(DC) restart

down:
	$(DC) down

down-v:
	$(DC) down -v

migrate:
	$(DC) exec backend python manage.py migrate

static:
	$(DC) exec backend python manage.py collectstatic --noinput

bash:
	$(DC) exec backend bash

superuser:
	$(DC) exec backend python manage.py createsu

psql:
	$(DC) exec db psql -U $(db_user) -d $(db_name)

