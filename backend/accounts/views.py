from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.response import Response

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "username": user.username,
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    })
