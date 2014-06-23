__author__ = 'fady'

from django.conf.urls import patterns, url
from questions import views

urlpatterns = patterns('',

                       # allauth package doesn't provide e profile page
                       url(r'^quest_list/$', views.quest_list, name='quest_list'),
                       )