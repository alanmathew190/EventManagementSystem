from django.db import models
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField
import uuid


class Event(models.Model):
    CATEGORY_CHOICES = [
        ("free", "Free"),
        ("paid", "Paid"),
    ]

    host = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="hosted_events"
    )

    title = models.CharField(max_length=150)
    description = models.TextField()

    # ✅ Cloudinary poster
    image = CloudinaryField("event_images", blank=True, null=True)

    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)

    place_name = models.CharField(max_length=200)
    location = models.CharField(max_length=300)
    date = models.DateTimeField()

    capacity = models.PositiveIntegerField(default=50)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class EventRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    is_paid = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    # ✅ Token only (React renders QR)
    qr_token = models.UUIDField(default=uuid.uuid4, unique=True)

    is_scanned = models.BooleanField(default=False)
    scanned_at = models.DateTimeField(null=True, blank=True)

    registered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "event")

    def __str__(self):
        return f"{self.user.username} → {self.event.title}"


class Payment(models.Model):
    STATUS_CHOICES = (
        ("CREATED", "Created"),
        ("PAID", "Paid"),
        ("FAILED", "Failed"),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    razorpay_order_id = models.CharField(max_length=200)
    razorpay_payment_id = models.CharField(max_length=200, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)

    amount = models.IntegerField()  # paise
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="CREATED")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.event.title} ({self.status})"
