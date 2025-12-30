from rest_framework import serializers
from .models import Event,EventRegistration


class EventSerializer(serializers.ModelSerializer):
    host = serializers.ReadOnlyField(source="host.username")
    attendees_count = serializers.SerializerMethodField()
    class Meta:
        model = Event
        fields = [
            "id",
            "host",
            "title",
            "description",
            "image",       # keep real field for upload
            "category",
            "place_name",
            "location",
            "date",
            "capacity",
            "price",
            "approved",
            "created_at",
            "attendees_count"
        ]
        read_only_fields = ["host", "approved", "created_at"]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        # ✅ Convert CloudinaryField → URL
        if instance.image:
            data["image"] = instance.image.url
        else:
            data["image"] = None

        return data
    def get_attendees_count(self, obj):
        return EventRegistration.objects.filter(
            event=obj,
            is_approved=True
        ).count()