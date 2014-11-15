from django.core.urlresolvers import reverse, reverse_lazy
from django.views.generic import TemplateView
from django.views.generic import UpdateView
from authentication.models import SeevcamUser
from common.mixins.authorization import LoginRequired
from common.mixins.pjax import PJAXResponseMixin
from userprofile.forms import UserProfileForm, NotificationForm
from models import UserNotifications


class UserProfileUpdate(LoginRequired, PJAXResponseMixin, UpdateView):
    model = SeevcamUser
    form_class = UserProfileForm
    template_name = "profile.html"
    pjax_template_name = "profile-update.html"
    success_url = reverse_lazy("profile_update")

    def get_template_names(self):
        if self.request.GET.get('_pjax', None) == '#container':
            self.pjax_template_name = None
        return super(UserProfileUpdate, self).get_template_names()

    def get_object(self):
        return self.request.user


class UserProfileNotifications(LoginRequired, PJAXResponseMixin, UpdateView):
    model = UserNotifications
    form_class = NotificationForm
    template_name = "profile.html"
    pjax_template_name = "profile-notifications.html"
    success_url = reverse_lazy("profile_notifications")

    def get_object(self):
        return self.request.user.notifications


class UserProfileSettings(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = 'profile.html'
    pjax_template_name = "profile-settings.html"


class UserProfileIntegration(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = "profile.html"
    pjax_template_name = "profile-integration.html"
