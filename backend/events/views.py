from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Event, EventRegistration
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Event.objects.filter(approved=True).order_by("-created_at")

        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(location__icontains=location)

        return queryset

    def perform_create(self, serializer):
        serializer.save(host=self.request.user, approved=False)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_event(request, event_id):
    user = request.user
    event = get_object_or_404(Event, id=event_id, approved=True)

    # ❌ Host cannot join own event
    if event.host == user:
        return Response(
            {"error": "Host cannot join own event"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ❌ Prevent duplicate registration
    if EventRegistration.objects.filter(user=user, event=event).exists():
        return Response(
            {"error": "Already registered"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ❌ Capacity check
    current_count = EventRegistration.objects.filter(event=event).count()
    if current_count >= event.capacity:
        return Response(
            {"error": "Event is full"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ FREE EVENT
    if event.category == "free":
        registration = EventRegistration.objects.create(
            user=user,
            event=event,
            is_paid=True
        )
        registration.generate_qr()
        registration.save()

        return Response({
            "message": "Registered Successfully",
            "qr_code": registration.qr_code.url
        })

    # 💰 PAID EVENT (payment pending)
    registration = EventRegistration.objects.create(
        user=user,
        event=event,
        is_paid=False
    )

    return Response({
        "message": "Registration created. Complete payment to receive QR",
        "registration_id": registration.id
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def confirm_payment(request, registration_id):
    registration = get_object_or_404(
        EventRegistration,
        id=registration_id,
    )

    if registration.is_paid:
        return Response(
            {"error": "Payment already completed"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ Simulate payment success
    registration.is_paid = True
    registration.generate_qr()
    registration.save()

    return Response({
        "message": "Payment successful",
        "qr_token":  registration.qr_code.url
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def scan_qr(request):
    qr_token = request.data.get("qr_token")

    if not qr_token:
        return Response(
            {"error": "QR token is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    registration = get_object_or_404(
        EventRegistration,
        qr_token=qr_token,
        is_paid=True
    )

    if registration.is_scanned:
        return Response(
            {"error": "QR already scanned"},
            status=status.HTTP_400_BAD_REQUEST
        )

    registration.is_scanned = True
    registration.scanned_at = timezone.now()
    registration.save()

    return Response({
        "message": "Attendance marked successfully",
        "user": registration.user.username,
        "event": registration.event.title,
        "scanned_at": registration.scanned_at
    })
