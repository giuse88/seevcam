from django.conf.urls import patterns, include, url
from django.contrib import admin
from authentication.views import login_or_redirect
from django.conf.urls.static import static
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', login_or_redirect, {'template_name': 'mock_login.html'}, name="login"),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^dashboard/', include('dashboard.urls')),
                       url(r'^interview/', include('interview_room.urls')),
)+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)