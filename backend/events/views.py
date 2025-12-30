from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.conf import settings
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Event, EventRegistration, Payment
from .serializers import EventSerializer

import razorpay
from razorpay.errors import SignatureVerificationError


# ----------------------------------
# Razorpay Client
# ----------------------------------
client = razorpay.Client(
    auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
)


# ----------------------------------
# EVENTS CRUD
# ----------------------------------
class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Event.objects.filter(
            approved=True,
            date__gte=timezone.now()
        ).order_by("date")

    def perform_create(self, serializer):
        serializer.save(host=self.request.user, approved=False)


# ----------------------------------
# JOIN EVENT
# ----------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_event(request, event_id):
    user = request.user
    event = get_object_or_404(Event, id=event_id, approved=True)

    if event.host == user:
        return Response({"error": "Host cannot join own event"}, status=400)

    if EventRegistration.objects.filter(user=user, event=event).exists():
        return Response({"error": "Already registered"}, status=400)

    if EventRegistration.objects.filter(event=event).count() >= event.capacity:
        return Response({"error": "Event is full"}, status=400)

    # FREE EVENT
    if event.category == "free":
        EventRegistration.objects.create(
            user=user,
            event=event,
            is_paid=True,
            is_approved=True
        )
        return Response({"message": "Registered successfully"})

    # PAID EVENT
    registration = EventRegistration.objects.create(
        user=user,
        event=event
    )

    return Response({
        "registration_id": registration.id,
        "message": "Proceed to payment"
    })


# ----------------------------------
# CREATE RAZORPAY ORDER
# ----------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_payment_order(request, registration_id):
    registration = get_object_or_404(EventRegistration, id=registration_id)

    if registration.is_paid:
        return Response({"error": "Already paid"}, status=400)

    amount = int(registration.event.price * 100)

    order = client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })

    Payment.objects.create(
        user=request.user,
        event=registration.event,
        razorpay_order_id=order["id"],
        amount=amount
    )

    return Response({
        "order_id": order["id"],
        "amount": amount,
        "key": settings.RAZORPAY_KEY_ID,
        "event_title": registration.event.title
    })


# ----------------------------------
# VERIFY PAYMENT (AUTO APPROVE)
# ----------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    data = request.data

    try:
        client.utility.verify_payment_signature({
            "razorpay_order_id": data["razorpay_order_id"],
            "razorpay_payment_id": data["razorpay_payment_id"],
            "razorpay_signature": data["razorpay_signature"],
        })

        payment = Payment.objects.get(
            razorpay_order_id=data["razorpay_order_id"]
        )
        payment.razorpay_payment_id = data["razorpay_payment_id"]
        payment.razorpay_signature = data["razorpay_signature"]
        payment.status = "PAID"
        payment.save()

        registration = EventRegistration.objects.get(
            user=request.user,
            event=payment.event
        )
        registration.is_paid = True
        registration.is_approved = True
        registration.save()

        return Response({"success": True})

    except SignatureVerificationError:
        return Response({"error": "Payment verification failed"}, status=400)


# ----------------------------------
# MY EVENTS
# ----------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_events(request):
    regs = EventRegistration.objects.filter(user=request.user).select_related("event")

    return Response([
        {
            "event_id": r.event.id,
            "title": r.event.title,
            "image": r.event.image.url if r.event.image else None,
            "date": r.event.date,
            "category": r.event.category,
            "place_name": r.event.place_name,
            "location": r.event.location,
            "is_paid": r.is_paid,
            "is_approved": r.is_approved,
            "qr_token": str(r.qr_token),
        }
        for r in regs
    ])


# ----------------------------------
# HOSTED EVENTS
# ----------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def hosted_events(request):
    events = Event.objects.filter(host=request.user)

    return Response([
        {
            "id": e.id,
            "title": e.title,
            "image": e.image.url if e.image else None,  # ✅ FIX
            "date": e.date,
            "approved": e.approved,
            "attendees": EventRegistration.objects.filter(event=e).count(),
        }
        for e in events
    ])



# ----------------------------------
# EVENT ATTENDEES (HOST)
# ----------------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def event_attendees(request, event_id):
    event = get_object_or_404(Event, id=event_id, host=request.user)

    regs = EventRegistration.objects.filter(event=event)

    return Response({
        "event": event.title,
        "attendees": [
            {
                "username": r.user.username,
                "is_paid": r.is_paid,
                "is_approved": r.is_approved,
                "is_scanned": r.is_scanned,
                "scanned_at": r.scanned_at,
            }
            for r in regs
        ]
    })


# ----------------------------------
# SCAN QR (HOST)
# ----------------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def scan_qr(request):
    qr_token = request.data.get("qr_token")

    reg = get_object_or_404(
        EventRegistration,
        qr_token=qr_token,
        is_paid=True,
        is_approved=True
    )

    if reg.event.host != request.user:
        return Response({"error": "Not authorized"}, status=403)

    if reg.is_scanned:
        return Response({"error": "Already scanned"}, status=400)

    reg.is_scanned = True
    reg.scanned_at = timezone.now()
    reg.save()

    return Response({
        "message": "Attendance marked",
        "user": reg.user.username
    })


# ----------------------------------
# ADMIN
# ----------------------------------
@api_view(["GET"])
@permission_classes([IsAdminUser])
def pending_events(request):
    events = Event.objects.filter(approved=False)
    return Response(EventSerializer(events, many=True).data)


@api_view(["POST"])
@permission_classes([IsAdminUser])
def approve_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    event.approved = True
    event.save()
    return Response({"message": "Event approved"})
