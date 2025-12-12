from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, JoinEventViewSet

router = DefaultRouter()
router.register("events", EventViewSet, basename="events")

urlpatterns = [
    path("events/<int:pk>/join/", JoinEventViewSet.as_view({"post": "create"})),
]

urlpatterns += router.urls
