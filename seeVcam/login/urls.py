__author__ = 'fady'

from django.conf.urls import patterns, url
from login import views

urlpatterns = patterns('',
                       # url(r'^login/$', views.user_login, name='login'),
                       # url(r'^logout/$', views.user_logout, name='logout'),
                       # allauth package doesn't provide e profile page
                       url(r'^$', views.home, name='home'),
                       url(r'^accounts/profile/$', views.welcome, name='welcome'),
                       url(r'^accounts/only_verified/$', views.verified_users_only_view, name='only_virified'),
)