from django.conf.urls import patterns, url
from django.views.generic import TemplateView
from interview_room.views import InterviewerView, InterviewRoomViewExperiment, IntervieweeView, \
    InterviewRoomViewExperimentEE

urlpatterns = patterns('',
                       # TO be removed
                       # url(r'^$', InterviewRoomViewExperiment.as_view(),
                       #     name='interview_room_experiment_ER'),
                       #
                       # url(r'interviewee/?$', InterviewRoomViewExperimentEE.as_view(),
                       #     name='interview_room_experiment_EE'),
                       #
                       # url(r'full-video/?$', InterviewRoomViewExperiment.as_view(),
                       #     name='interview_room'),
                       #
                       # url(r'questions/?$', InterviewRoomViewExperiment.as_view(),
                       #     name='interview_room'),

                       url(r'1/(?P<interview_id>[0-9]+)/(?P<token>\w+)/?$',
                           IntervieweeView.as_view(),
                           name='interviewee_view'),

                       url(r'0/(?P<interview_id>[0-9]+)/$',
                           InterviewerView.as_view(),
                           name='interviewer_view'),

                       url(r'0/(?P<interview_id>[0-9]+)/questions/?$',
                           InterviewerView.as_view(),
                           name='interviewer_question_view'),

                       url(r'^completed/',
                           TemplateView.as_view(template_name="interview_completed.html"),
                           name='interview_completed'
                       )
)