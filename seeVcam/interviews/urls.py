__author__ = 'fady'

from django.conf.urls import patterns, url
from interviews import views

urlpatterns = patterns('',

                       # allauth package doesn't provide e profile page
                       url(r'^int_list/$', views.int_list, name='int_list'),
)