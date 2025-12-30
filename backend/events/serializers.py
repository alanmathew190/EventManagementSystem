from rest_framework import serializers
from .models import Event, EventRegistration


class EventSerializer(serializers.ModelSerializer):
    attendees_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "category",
            "place_name",
            "location",
            "date",
            "capacity",
            "price",
            "upi_id",
            "approved",
            "image",
            "attendees_count",
        ]

    def get_attendees_count(self, obj):
        return EventRegistration.objects.filter(event=obj).count()

    def get_image(self, obj):
        if obj.image:
            try:
                return obj.image.url
            except:
                return None
        return None
