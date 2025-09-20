from rest_framework.routers import DefaultRouter
from .views import TodoViewSet
from django.urls import path, include

router = DefaultRouter()
router.register(r"todo_list", TodoViewSet, basename="todo")

urlpatterns = [
    path("", include(router.urls)),
]