from django.conf.urls import patterns, url
from events.views import EventList

rest_patterns = patterns('',
                         url(r'(?P<interview_id>[0-9]+)/events/?$', EventList.as_view(), name='event-list'))

urlpatterns = rest_patterns