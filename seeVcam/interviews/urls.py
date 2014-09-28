from django.conf.urls import patterns, url
from interviews.views import InterviewsView, CreateInterviewView, UpdateInterviewView

urlpatterns = patterns('',
                       url(r'^$', InterviewsView.as_view(), name='interviews'),
                       url(r'^create/', CreateInterviewView.as_view(), name='create-interview'),
                       url(r'^update/(?P<pk>\d+)', UpdateInterviewView.as_view(), name='update-interview'),
)