from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    host_name = serializers.CharField(source="host.username", read_only=True)
    attendees_count = serializers.IntegerField(
        source="attendees.count", read_only=True
    )
    image = serializers.ImageField(required=False)

    class Meta:
        model = Event
        fields = "__all__"   # ✅ MUST be a string, not a list
        read_only_fields = ["host", "approved", "qr_code", "attendees"]
