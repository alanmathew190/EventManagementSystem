from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    host_name = serializers.CharField(source='host.username', read_only=True)
    attendees_count = serializers.IntegerField(source='attendees.count', read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "host",
            "host_name",
            "title",
            "description",
            "category",
            "place_name",
            "location",
            "date",
            "capacity",
            "attendees",
            "attendees_count",
            "upi_id",
            "price",
            "qr_code",
            "approved",
            "created_at",
        ]
        read_only_fields = ["host", "approved", "qr_code", "attendees"]
