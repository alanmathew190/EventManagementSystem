from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register("events", EventViewSet, basename="events")

urlpatterns = [
    path("events/<int:event_id>/join/", join_event),
    path("payments/create/<int:registration_id>/", create_payment_order),
    path("payments/verify/", verify_payment),

    path("my-events/", my_events),
    path("hosted/", hosted_events),
    path("hosted/<int:event_id>/attendees/", event_attendees),
    path("events/scan-qr/", scan_qr),

    path("admin/events/pending/", pending_events),
    path("admin/events/<int:event_id>/approve/", approve_event),
]

urlpatterns += router.urls
