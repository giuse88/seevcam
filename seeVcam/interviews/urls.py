from django.conf.urls import patterns, url, include
from interviews.views import InterviewsView, CreateInterviewView, UpdateInterviewView
from notes.urls import urlpatterns as urlpatterns_notes
from notes.views import NotesRESTView

urlpatterns = patterns('',
                       url(r'^$', InterviewsView.as_view(), name='interviews'),
                       url(r'^create/', CreateInterviewView.as_view(), name='create-interview'),
                       url(r'^update/(?P<pk>\d+)', UpdateInterviewView.as_view(), name='update-interview'),
                       url(r'', include('notes.urls'))
)

