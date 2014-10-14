from django.conf.urls import patterns, url

from notes.views import NotesRESTView


"""
REST requests
"""
rest_url = patterns('',
                    url(r'(?P<pk>[0-9]+)/notes/$', NotesRESTView.as_view()),
)

"""
HTML requests
"""
default_url = patterns('', )

urlpatterns = rest_url + default_url



