from django.conf.urls import patterns, url
from django.views.generic import TemplateView
from interview_room.views import InterviewRoomView, InterviewerView

urlpatterns = patterns('',
                       url(r'^$', InterviewRoomView.as_view(),
                           name='interview_room'),

                       url(r'1/(?P<interview_id>[0-9]+)/(?P<interview_token>[0-9])/?$',
                           InterviewerView.as_view(),
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