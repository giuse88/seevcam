from django.conf.urls import patterns, url
from django.core.urlresolvers import reverse_lazy
from django.views.generic import RedirectView

from views import UserProfileUpdate, UserProfileNotifications, UserProfileSettings, UserProfileIntegration

html_patterns = patterns('',
                         url(r'^update/$', UserProfileUpdate.as_view(), name='profile_update'),
                         url(r'^notifications/$', UserProfileNotifications.as_view(), name='profile_notifications'),
                         url(r'^settings/$', UserProfileSettings.as_view(), name='profile_settings'),
                         url(r'^integrations/$', UserProfileIntegration.as_view(), name='profile_integration'),
                         url(r'^$', RedirectView.as_view(url=reverse_lazy('profile_update')), name='user_profile'),
                         )

urlpatterns = html_patterns