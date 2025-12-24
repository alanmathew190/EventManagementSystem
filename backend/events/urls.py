from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    EventViewSet,
    join_event,
    confirm_payment,
    scan_qr,
    my_events
)

router = DefaultRouter()
router.register("events", EventViewSet, basename="events")

urlpatterns = [
    # 🔗 Join event (free / paid)
    path("events/<int:event_id>/join/", join_event),

    # 💳 Confirm payment (paid events)
    path("payments/confirm/<int:registration_id>/", confirm_payment),

    # 📸 Scan QR (attendance)
    path("events/scan-qr/", scan_qr),
    
    path("my-events/", my_events),

    
]

urlpatterns += router.urls
