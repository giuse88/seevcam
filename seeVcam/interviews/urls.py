from django.conf.urls import patterns, url, include

from dashboard.views import DashboardView as EmptyView
from rest_views import InterviewDetail, InterviewList, JobPositionList

rest_patterns = patterns('',
                         url(r'interviews/(?P<pk>[0-9]+)/?$', InterviewDetail.as_view()),
                         url(r'jobPositions/?$', JobPositionList.as_view()),
                         url(r'interviews/?$', InterviewList.as_view()))


html_patterns = patterns('',
                         url(r'', include('answers.urls')),
                         url(r'', include('notes.urls')),
                         url(r'^$', EmptyView.as_view(), name='interviews'),
                         url(r'(?P<pk>[0-9]+)/?$', EmptyView.as_view(), name='interview'),
                         url(r'^create/', EmptyView.as_view(), name='create-interview'))

urlpatterns = rest_patterns + html_patterns
