from django.conf.urls import patterns, url
from notes.views import NotesRESTView


rest_url = patterns('',
                    url(r'(?P<pk>[0-9]+)/notes/$', NotesRESTView.as_view()))


urlpatterns = rest_url



