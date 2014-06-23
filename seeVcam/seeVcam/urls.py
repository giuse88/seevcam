from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'seeVcam.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('login.urls')),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^interviews/', include('interviews.urls')),
    url(r'^questions/', include('questions.urls')),
)
