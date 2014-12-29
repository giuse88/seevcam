from django.conf.urls import patterns, url

from answers.views import AnswerList, AnswerDetails


rest_patterns = patterns('',
                         url(r'(?P<interview_id>[0-9]+)/answers/?$', AnswerList.as_view(), name='answer-list'),
                         url(r'(?P<interview_id>[0-9]+)/answers/(?P<pk>[0-9]+)/?$', AnswerDetails.as_view(),
                             name='answer-details'))

urlpatterns = rest_patterns