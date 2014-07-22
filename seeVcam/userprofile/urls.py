from django.conf.urls import patterns, url
from views import UserProfileView, UserProfileUpdate, UserProfileSettings

urlpatterns = patterns('',
                       url(r'^$', UserProfileView.as_view(), name='user_profile'),
                       url(r'^(?P<pk>\d+)/update/$', UserProfileUpdate.as_view(), name='profile_update'),
                       url(r'^(?P<pk>\d+)/settings/$',UserProfileSettings.as_view(), name='profile_settings'),
)