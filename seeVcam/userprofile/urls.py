from django.conf.urls import patterns, url, include
from django.views.generic import RedirectView
from views import UserProfileView, UserProfileUpdate, UserProfileSettings, UserProfileNotifications
from django.contrib.auth.views import password_change

urlpatterns = patterns('',
                       url(r'^$', UserProfileView.as_view(), name='user_profile'),
                       url(r'^(?P<pk>\d+)/update/$', UserProfileUpdate.as_view(), name='profile_update'),
                       url(r'^(?P<pk>\d+)/notifications/$', UserProfileNotifications.as_view(),
                           name='profile_notifications'),
                       # url(r'^(?P<pk>\d+)/settings/$', password_change(repost_change_redirect='dashboard/'),
                       #     name='profile_settings'),
                       url(r'^(?P<pk>\d+)/settings/$',
                           'django.contrib.auth.views.password_change',
                           {'post_change_redirect': '/dashboard'},
                           name="profile_settings"),

                       # url(r'^(?P<pk>\d+)/settings/$', RedirectView.as_view(url='/accounts/password_change/'), name='profile_settings'),

)