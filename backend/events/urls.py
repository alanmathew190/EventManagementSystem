from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    EventViewSet,
    join_event,
    confirm_payment,
    scan_qr,
    my_events,
    hosted_events,
    event_attendees,
    approve_registration,
    pending_events,
    approve_event,
)

router = DefaultRouter()
router.register("events", EventViewSet, basename="events")

urlpatterns = [
    # 🔗 User actions
    path("events/<int:event_id>/join/", join_event),
    path("payments/confirm/<int:registration_id>/", confirm_payment),
    path("events/scan-qr/", scan_qr),
    path("my-events/", my_events),

    # 🎤 Host actions
    path("hosted/", hosted_events),
    path("hosted/<int:event_id>/attendees/", event_attendees),
    path("approve/<int:registration_id>/", approve_registration),

    # 🛡️ Admin actions
    path("admin/events/pending/", pending_events),
    path("admin/events/<int:event_id>/approve/", approve_event),
]

urlpatterns += router.urls
