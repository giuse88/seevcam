from django.conf.urls import patterns, url

from .views import OverallRatingList, OverallRatingUpdate

rest_patterns = patterns('',
                         url(r'(?P<interview_id>[0-9]+)/overall_ratings/?$', OverallRatingList.as_view(),
                             name='overall_ratings_list'),
                         url(r'(?P<interview_id>[0-9]+)/overall_ratings/(?P<pk>[0-9]+)/?$',
                             OverallRatingUpdate.as_view(), name='overall_ratings_update'))

urlpatterns = rest_patterns