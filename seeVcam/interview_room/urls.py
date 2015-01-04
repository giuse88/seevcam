from django.conf.urls import patterns, url
from interview_room.views import InterviewRoomView, InterviewerView

urlpatterns = patterns('',
                       url(r'^$', InterviewRoomView.as_view(),
                           name='interview_room'),

                       url(r'1/(?P<interview_id>[0-9]+)/(?P<interview_token>[0-9])/?$',
                           InterviewerView.as_view(),
                           name='interviewee_view'),

                       url(r'0/(?P<interview_id>[0-9]+)/$',
                           InterviewerView.as_view(),
                           name='interviewer_view')
)