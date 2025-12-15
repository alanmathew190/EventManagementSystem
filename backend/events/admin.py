from django.contrib import admin
from .models import Event
from .models import EventRegistration

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "host",
        "category",
        "location",
        "date",
        "capacity",
        "approved",
        "created_at",
    )

    list_filter = ("category", "approved", "location")
    search_fields = ("title", "location", "host__username")
    ordering = ("-created_at",)
from .models import EventRegistration

@admin.register(EventRegistration)
class EventRegistrationAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "event",
        "is_paid",
        "is_scanned",
        "registered_at",
    )
