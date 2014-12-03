from django.conf.urls import patterns, url
from dashboard.views import DashboardView as EmptyView
from interviews.views import CreateInterviewView

html_patterns = patterns('',
                         url(r'^$', EmptyView.as_view(), name='interviews'),
                         url(r'(?P<pk>[0-9]+)/?$', EmptyView.as_view(), name='interview'),
                         url(r'^create/', CreateInterviewView.as_view(), name='create-interview'),)
urlpatterns = html_patterns
