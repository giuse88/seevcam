from django.conf.urls import patterns, url
from interview_room.views import InterviewRoomView

urlpatterns = patterns('',
                       url(r'^$', InterviewRoomView.as_view(), name='interview_room'),
)