from django.conf.urls import patterns, url
from dashboard.views import DashboardView as EmptyView

html_patterns = patterns('',
                         url(r'^$', EmptyView.as_view(), name='interviews'),
                         url(r'(?P<pk>[0-9]+)/?$', EmptyView.as_view(), name='interview'))

urlpatterns = html_patterns
