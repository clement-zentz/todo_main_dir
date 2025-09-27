# 📝 Todo List App

A full-stack **Todo List application** built with **Django REST Framework**, **PostgreSQL**, and **React/TypeScript**.  
This project is currently in **development mode** and runs locally with Docker.

---

## 🛠 Tech Stack

- **Backend**: Django, Django REST Framework, PostgreSQL  
- **Frontend**: React, TypeScript, HTML, CSS  
- **DevOps**: Docker, docker-compose, Git

---

## 🚀 Features

- ✅ Create, Read, Update, and Delete tasks  
- ✅ API powered by Django REST Framework  
- ✅ JWT Authentication  

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📂 Project Structure

```bash
.
├── Makefile
├── README
├── backend
│   ├── Dockerfile
│   ├── db.sqlite3
│   ├── manage.py
│   ├── pytest.ini
│   ├── requirements.txt
│   ├── scripts
│   │   ├── api_request.sh
│   │   ├── gen_secret_key.py
│   │   └── test.sh
│   ├── todo_app
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── management
│   │   ├── migrations
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── tests
│   │   ├── urls.py
│   │   └── views.py
│   └── todo_project
│       ├── __init__.py
│       ├── asgi.py
│       ├── settings
│       ├── urls.py
│       └── wsgi.py
├── db.sqlite3
├── docker-compose.override.yml
├── docker-compose.yml
└── frontend
    └── todo_front
        ├── Dockerfile
        ├── README.md
        ├── dist
        ├── eslint.config.js
        ├── index.html
        ├── package-lock.json
        ├── package.json
        ├── public
        ├── src
        ├── tsconfig.json
        └── vite.config.ts

14 directories, 32 files
```