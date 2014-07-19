from django.conf.urls import patterns, include, url
from django.contrib import admin
from authentication.views import login_or_redirect

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', login_or_redirect, {'template_name': 'mock_login.html'}, name="login"),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^dashboard/', include('dashboard.urls')),
)
