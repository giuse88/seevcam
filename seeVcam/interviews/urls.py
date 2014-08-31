from django.conf.urls import patterns, url
from interviews.views import InterviewsView, CreateInterviewView

urlpatterns = patterns('',
                       url(r'^$', InterviewsView.as_view(), name='interviews'),
                       url(r'^create/', CreateInterviewView.as_view(), name='create-interview')
)