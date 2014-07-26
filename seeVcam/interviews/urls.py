from django.conf.urls import patterns, url
from interviews.views import InterviewsView

urlpatterns = patterns('',
                       url(r'^$', InterviewsView.as_view(), name='interviews'),
)