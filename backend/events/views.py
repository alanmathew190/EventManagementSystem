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

        # 🔍 Location search using place_name
        place = self.request.query_params.get("location")
        if place:
            queryset = queryset.filter(place_name__icontains=place)

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
        "qr_image": registration.qr_code.url  # ✅ THIS IS THE FIX
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

    event = registration.event

    # 🔒 ONLY HOST OF THIS EVENT CAN SCAN
    if request.user != event.host:
        return Response(
            {"error": "You are not authorized to scan this event QR"},
            status=status.HTTP_403_FORBIDDEN
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
        "event": event.title,
        "scanned_at": registration.scanned_at
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_events(request):
    registrations = EventRegistration.objects.filter(
        user=request.user,
        is_paid=True
    ).select_related("event")

    data = []
    for reg in registrations:
        data.append({
            "event_id": reg.event.id,
            "title": reg.event.title,
            "location": reg.event.location,
            "date": reg.event.date,
            "category": reg.event.category,
            "qr_image": reg.qr_code.url if reg.qr_code else None,
             "qr_token": str(reg.qr_token),
            "is_scanned": reg.is_scanned,
        })

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def hosted_events(request):
    events = Event.objects.filter(host=request.user)

    data = []
    for event in events:
        data.append({
            "id": event.id,
            "title": event.title,
            "date": event.date,
            "location": event.location,
            "capacity": event.capacity,
            "approved": event.approved,
            "attendees_count": EventRegistration.objects.filter(event=event).count(),
        })

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def event_attendees(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    # 🔒 Only host can view attendees
    if request.user != event.host:
        return Response(
            {"error": "You are not authorized to view attendees for this event"},
            status=status.HTTP_403_FORBIDDEN
        )

    registrations = EventRegistration.objects.filter(
        event=event,
        is_paid=True
    ).select_related("user")

    data = []
    for reg in registrations:
        data.append({
            "username": reg.user.username,
            "is_scanned": reg.is_scanned,
            "scanned_at": reg.scanned_at,
        })

    return Response({
        "event": event.title,
        "attendees": data
    })
    
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    # 🔒 Only host can delete
    if request.user != event.host:
        return Response(
            {"error": "Not authorized"},
            status=status.HTTP_403_FORBIDDEN
        )

    # ❌ Paid events cannot be deleted
    if event.category == "paid":
        return Response(
            {"error": "Paid events cannot be deleted"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ Soft cancel instead of hard delete
    event.is_cancelled = True
    event.cancel_message = "Event canceled by host"
    event.save()

    return Response(
        {"message": "Event canceled successfully"},
        status=status.HTTP_200_OK
    )
    
def perform_update(self, serializer):
    event = self.get_object()

    if self.request.user != event.host:
        raise PermissionDenied("You cannot edit this event")

    serializer.save()

