from django.conf.urls import patterns, url

from views import UserProfileView, UserProfileUpdate, UserProfileNotifications, UserProfileSettings


urlpatterns = patterns('',
                       url(r'^$', UserProfileView.as_view(), name='user_profile'),
                       url(r'^(?P<pk>\d+)/update/$', UserProfileUpdate.as_view(), name='profile_update'),
                       url(r'^(?P<pk>\d+)/notifications/$', UserProfileNotifications.as_view(), name='profile_notifications'),
                       url(r'^(?P<pk>\d+)/settings/$', UserProfileSettings.as_view(),name='profile_settings')
)