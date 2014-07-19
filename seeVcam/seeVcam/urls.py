from django.conf.urls import patterns, include, url
from django.contrib import admin

admin.autodiscover()

urlpatterns = patterns('',
                       # url(r'^$', TemplateView.),
                       url(r'^admin/$', include(admin.site.urls)),

                       url(r'^dashoboard/$', include('dashboard.urls')),
                       url(r'^interviews/', include('interviews.urls')),
                       url(r'^questions/', include('questions.urls')),
)
