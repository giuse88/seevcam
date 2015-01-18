from django.conf.urls import patterns, url
from interview_room.views import InterviewerView, InterviewRoomViewExperiment, IntervieweeView

urlpatterns = patterns('',
                       # TO be removed
                       url(r'^$', InterviewRoomViewExperiment.as_view(),
                           name='interview_room'),

                       url(r'full-video/?$', InterviewRoomViewExperiment.as_view(),
                           name='interview_room'),

                       url(r'questions/?$', InterviewRoomViewExperiment.as_view(),
                           name='interview_room'),

                       url(r'1/(?P<interview_id>[0-9]+)/(?P<token>\w+)/?$',
                           IntervieweeView.as_view(),
                           name='interviewee_view'),

                       url(r'0/(?P<interview_id>[0-9]+)/$',
                           InterviewerView.as_view(),
                           name='interviewer_view')
)