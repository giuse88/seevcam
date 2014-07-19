from django.conf.urls import patterns, url
from views import DashboardView

urlpatterns = patterns('',
                       url(r'^$', DashboardView.as_view(), name='dashboard'),
)
