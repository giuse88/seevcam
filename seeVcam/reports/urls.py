from django.conf.urls import patterns, url
from dashboard.views import DashboardView as EmptyView

urlpatterns = patterns('',
                       url(r'^$', EmptyView.as_view(), name='reports'),
                       url(r'(?P<pk>[0-9]+)/?$', EmptyView.as_view(), name='report')
)