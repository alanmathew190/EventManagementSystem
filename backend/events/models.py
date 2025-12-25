from django.db import models
from django.contrib.auth.models import User
import uuid
import qrcode
from django.core.files import File
from io import BytesIO

class Event(models.Model):
    CATEGORY_CHOICES = [
        ("free", "Free"),
        ("paid", "Paid"),
    ]

    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="hosted_events")
    title = models.CharField(max_length=150)
    description = models.TextField()
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)

    place_name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    date = models.DateTimeField()

    capacity = models.PositiveIntegerField(default=50)  # max attendees
    attendees = models.ManyToManyField(User, related_name="joined_events", blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # QR will be generated only for paid events
    qr_code = models.ImageField(upload_to="qr_codes/", null=True, blank=True)
    
    payment_qr = models.ImageField(
    upload_to="payment_qr/",
    null=True,
    blank=True
)

    # Admin approval
    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class EventRegistration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    event = models.ForeignKey(Event, on_delete=models.CASCADE)

    # payment + QR logic
    is_paid = models.BooleanField(default=False)
    qr_token = models.UUIDField(default=uuid.uuid4, unique=True)
    
    qr_code = models.ImageField(upload_to="registration_qr/", null=True, blank=True)

    # scan / attendance
    is_scanned = models.BooleanField(default=False)
    scanned_at = models.DateTimeField(null=True, blank=True)

    registered_at = models.DateTimeField(auto_now_add=True)

    is_approved = models.BooleanField(default=False)

 

    class Meta:
        unique_together = ("user", "event")  # PREVENT DUPLICATES

    def __str__(self):
        return f"{self.user.username} → {self.event.title}"
    
    def generate_qr(self):
        """Generate a QR code for this registration"""
        qr_img = qrcode.make(str(self.qr_token))  # encode UUID
        blob = BytesIO()
        qr_img.save(blob, 'PNG')
        blob.seek(0)
        self.qr_code.save(f"qr_{self.user.username}_{self.id}.png", File(blob), save=False)

