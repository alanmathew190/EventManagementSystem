from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    EventViewSet,
    join_event,
    scan_qr,
    my_events,
    hosted_events,
    event_attendees,
    pending_events,
    approve_event,
    create_payment_order,
    verify_payment,
)

router = DefaultRouter()
router.register("events", EventViewSet, basename="events")

urlpatterns = [
    # --------------------
    # User actions
    # --------------------
    path("events/<int:event_id>/join/", join_event),
    path("my-events/", my_events),

    # Razorpay
    path("payments/create/<int:registration_id>/", create_payment_order),
    path("payments/verify/", verify_payment),

    # --------------------
    # Host actions
    # --------------------
    path("hosted/", hosted_events),
    path("hosted/<int:event_id>/attendees/", event_attendees),
    path("events/scan-qr/", scan_qr),

    # --------------------
    # Admin actions
    # --------------------
    path("admin/events/pending/", pending_events),
    path("admin/events/<int:event_id>/approve/", approve_event),
]

urlpatterns += router.urls
