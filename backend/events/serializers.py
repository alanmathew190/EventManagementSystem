from rest_framework import serializers
from .models import Event, EventRegistration


class EventSerializer(serializers.ModelSerializer):
    attendees_count = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()
    user_registration = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "image",
            "category",
            "place_name",
            "location",
            "date",
            "capacity",
            "price",
            "approved",
            "attendees_count",
            "user_registration",
        ]

    def get_attendees_count(self, obj):
        return EventRegistration.objects.filter(event=obj).count()

    def get_image(self, obj):
        return obj.image.url if obj.image else None

    def get_user_registration(self, obj):
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return None

        reg = EventRegistration.objects.filter(
            user=request.user,
            event=obj
        ).first()

        if not reg:
            return None

        if not reg.is_paid:
            status = "pending_payment"
        elif reg.is_paid:
            status = "approved"

        return {
            "id": reg.id,
            "status": status,
            "qr_token": str(reg.qr_token),
        }
