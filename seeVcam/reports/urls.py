from django.conf.urls import patterns, url, include
from .views import GridReportView,ListReportView

urlpatterns = patterns('',
                       url(r'^$', GridReportView.as_view(), name='reports'),
                       url(r'^list/$', ListReportView.as_view(), name='reports-list'),
                       url(r'(?P<pk>[0-9]+)/notes/', include('notes.urls'))
)