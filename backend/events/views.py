from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.permissions import IsAdminUser

from rest_framework.permissions import IsAdminUser

from .models import Event, EventRegistration
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        now = timezone.now()

        queryset = Event.objects.filter(
            approved=True,
             date__gte=now      # ✅ ONLY FUTURE EVENTS
        ).order_by("date")     # upcoming first

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
        is_paid=False,
        is_approved=False
    )

    return Response({
        "message": "Registration created. Complete payment to receive QR",
        "registration_id": registration.id
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def confirm_payment(request, registration_id):
    registration = get_object_or_404(EventRegistration, id=registration_id)

    if registration.is_paid:
        return Response(
            {"error": "Payment already submitted"},
            status=status.HTTP_400_BAD_REQUEST
        )

    payment_reference = request.data.get("payment_reference")

    if not payment_reference:
        return Response(
            {"error": "Payment reference is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Save payment info (approval still pending)
    registration.payment_reference = payment_reference
    registration.is_paid = True
    registration.save()

    return Response({
        "message": "Payment submitted successfully. Waiting for host approval."
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
        is_paid=True,
        is_approved=True   # ✅ FIXED
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
        user=request.user
    ).select_related("event")

    data = []
    for reg in registrations:
        data.append({
            "event_id": reg.event.id,
            "title": reg.event.title,
            "date": reg.event.date,
            "category": reg.event.category,
            "place_name": reg.event.place_name,
            "location": reg.event.location,

            # ✅ REGISTRATION STATUS
            "is_paid": reg.is_paid,
            "is_approved": reg.is_approved,
            "is_scanned": reg.is_scanned,

            # ✅ QR DETAILS (ONLY AFTER APPROVAL)
            "qr_image": reg.qr_code.url if reg.qr_code else None,
            "qr_token": str(reg.qr_token) if reg.qr_token else None,
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
            {"error": "You are not authorized to view attendees"},
            status=status.HTTP_403_FORBIDDEN
        )

    registrations = EventRegistration.objects.filter(
        event=event
    ).select_related("user")

    data = []
    for reg in registrations:
        data.append({
            "id": reg.id,  # ✅ REQUIRED for approve button
            "username": reg.user.username,

            # ✅ THIS WAS MISSING
            "payment_reference": reg.payment_reference,

            "is_paid": reg.is_paid,
            "is_approved": reg.is_approved,
            "is_scanned": reg.is_scanned,
            "scanned_at": reg.scanned_at,
        })

    return Response({
        "event": event.title,
        "attendees": data
    })



    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def approve_registration(request, registration_id):
    registration = get_object_or_404(EventRegistration, id=registration_id)

    # Only host can approve
    if registration.event.host != request.user:
        return Response(
            {"error": "Not authorized"},
            status=status.HTTP_403_FORBIDDEN
        )

    registration.is_paid = True
    registration.is_approved = True
    registration.generate_qr()
    registration.save()

    return Response({"message": "User approved successfully"})



@api_view(["GET"])
@permission_classes([IsAdminUser])
def admin_events(request):
    events = Event.objects.all().order_by("-created_at")

    data = []
    for event in events:
        data.append({
            "id": event.id,
            "title": event.title,
            "host": event.host.username,
            "category": event.category,
            "date": event.date,
            "approved": event.approved,
        })

    return Response(data)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def approve_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    event.approved = True
    event.save()
    return Response({"message": "Event approved"})


@api_view(["GET"])
@permission_classes([IsAdminUser])
def pending_events(request):
    events = Event.objects.filter(approved=False)

    data = []
    for event in events:
        data.append({
            "id": event.id,
            "title": event.title,
            "host": event.host.username,
            "place_name": event.place_name,
            "date": event.date,
            "category": event.category,
            "price": event.price,
            "capacity": event.capacity,
        })

    return Response(data)




