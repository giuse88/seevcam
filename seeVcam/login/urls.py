__author__ = 'fady'

from django.conf.urls import patterns, url
from login import views

urlpatterns = patterns('',
                       url(r'^login/$', views.user_login, name='login'),
                       url(r'^logout/$', views.user_logout, name='logout'),
                       url(r'^$', views.home, name='home'),
                       url(r'^welcome/$', views.welcome, name='welcome'),
)