from django.conf.urls import patterns, url
from views import UserProfileView

urlpatterns = patterns('',
                       url(r'^$', UserProfileView.as_view(), name='user_profile'),
)