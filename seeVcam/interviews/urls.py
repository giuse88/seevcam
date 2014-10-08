<<<<<<< HEAD
from django.conf.urls import patterns, url, include
from interviews.views import InterviewsView, CreateInterviewView, UpdateInterviewView
from notes.urls import urlpatterns as urlpatterns_notes
from notes.views import NotesRESTView
=======
from django.conf.urls import patterns, url
from interviews.views import InterviewsView, GridInterviewsView, ListInterviewsView, CalendarInterviewsView, CreateInterviewView, UpdateInterviewView
>>>>>>> Add interviews view, initial version

urlpatterns = patterns('',
                       url(r'^$', GridInterviewsView.as_view(), name='interviews'),
                       url(r'^list/$', ListInterviewsView.as_view(), name='interviews-list'),
                       url(r'^calendar/$', CalendarInterviewsView.as_view(), name='interviews-calendar'),
                       # url(r'^grid/$', GridInterviewsView.as_view(), name='interviews'),
                       url(r'^create/', CreateInterviewView.as_view(), name='create-interview'),
                       url(r'^update/(?P<pk>\d+)', UpdateInterviewView.as_view(), name='update-interview'),
                       url(r'', include('notes.urls'))
)

