from django.conf.urls import patterns, include, url

from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', include('home.urls')),
                       url(r'^about/$', include('about.urls')),
                       url(r'^contact/$', include('contact.urls')),
                       url(r'^recoverinterview/$', include('recoverInterview.urls')),
                       url(r'^login/$', include('login.urls')),
                       url(r'^admin/', include(admin.site.urls)),
)
