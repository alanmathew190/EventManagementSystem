from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    CATEGORY_CHOICES = [
        ("free", "Free"),
        ("paid", "Paid"),
    ]

    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name="hosted_events")
    title = models.CharField(max_length=150)
    description = models.TextField()
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)

    location = models.CharField(max_length=200)
    date = models.DateTimeField()

    capacity = models.PositiveIntegerField(default=50)  # max attendees
    attendees = models.ManyToManyField(User, related_name="joined_events", blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    # QR will be generated only for paid events
    qr_code = models.ImageField(upload_to="qr_codes/", null=True, blank=True)

    # Admin approval
    approved = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
