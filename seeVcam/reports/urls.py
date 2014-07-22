from django.conf.urls import patterns, url
from views import ReportView

urlpatterns = patterns('',
                       url(r'^$', ReportView.as_view(), name='reports'),
)