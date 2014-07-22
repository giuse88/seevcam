from django.conf.urls import patterns, url
from interviews import views

urlpatterns = patterns('',

                       # allauth package doesn't provide e profile page
                       url(r'^$', views.int_list, name='interviews'),
)