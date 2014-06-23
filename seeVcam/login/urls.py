__author__ = 'fady'

from django.conf.urls import patterns, url
from login import views

urlpatterns = patterns('',

                       # allauth package doesn't provide e profile page
                       url(r'^$', views.home, name='home'),
                       url(r'^accounts/profile/$', views.welcome, name='account_profile'),
                       url(r'^accounts/only_verified/$', views.verified_users_only_view, name='only_virified'),
)