from django.conf.urls import patterns, include, url
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^$', include('website.urls')),
                       url(r'^admin/$', include(admin.site.urls)),
                       url(r'^app/interviews/$', include('interviews.urls')),
                       url(r'^app/questions/$', include('questions.urls')),
)
