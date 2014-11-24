from django.conf.urls import patterns, url
from dashboard.views import DashboardView as EmptyView
from rest_views import InterviewDetail, InterviewList

rest_patterns = patterns('',
                         url(r'^interviews/(?P<pk>[0-9]+)/?$', InterviewDetail.as_view()),
                         url(r'interviews/?$', InterviewList.as_view()))

html_patterns = patterns('',
                         url(r'^$', EmptyView.as_view(), name='interviews'),
                         url(r'(?P<pk>[0-9]+)/?$', EmptyView.as_view(), name='interview'))

urlpatterns = rest_patterns + html_patterns
