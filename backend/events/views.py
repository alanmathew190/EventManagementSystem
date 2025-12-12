from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Event
from .serializers import EventSerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by("-created_at")
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(host=self.request.user)

    def get_queryset(self):
        qs = Event.objects.filter(approved=True)  # only approved events for normal users
        location = self.request.query_params.get("location", None)
        if location:
            qs = qs.filter(location__icontains=location)
        return qs


class JoinEventViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def create(self, request, pk=None):
        try:
            event = Event.objects.get(pk=pk)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=404)

        if event.attendees.count() >= event.capacity:
            return Response({"error": "Event capacity full"}, status=400)

        event.attendees.add(request.user)
        event.save()

        return Response({"message": "Joined event successfully"})
