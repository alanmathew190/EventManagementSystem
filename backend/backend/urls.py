from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # Auth (dj-rest-auth)
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),

    # Google JWT login (custom)
    path("api/auth/", include("accounts.urls")),

    # Allauth (required internally for Google provider)
    path("accounts/", include("allauth.urls")),

    # App APIs
    path("api/accounts/", include("accounts.urls")),
    path("api/events/", include("events.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
