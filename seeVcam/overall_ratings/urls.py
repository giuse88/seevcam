from django.conf.urls import patterns, url

from answers.views import AnswerList, AnswerDetails


rest_patterns = patterns('',
                         url(r'(?P<interview_id>[0-9]+)/overall_ratings/?$', AnswerList.as_view(),
                             name='overall_ratings_list'),
                         url(r'(?P<interview_id>[0-9]+)/overall_ratings/(?P<pk>[0-9]+)/?$', AnswerDetails.as_view(),
                             name='overall_ratings_update'))

urlpatterns = rest_patterns