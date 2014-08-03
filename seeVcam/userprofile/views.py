from django.core.urlresolvers import reverse
from django.http import Http404
from django.views.generic import TemplateView
from django.views.generic import UpdateView
from authentication.models import SeevcamUser
from common.mixins.authorization import LoginRequired, IsOwnerOr404
from common.mixins.pjax import PJAXResponseMixin
from userprofile.forms import UserprofileForm, NotificationForm
from userprofile.models import UserNotifications


class UserProfileView(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = 'profile.html'


class UserProfileUpdate(LoginRequired, IsOwnerOr404, PJAXResponseMixin, UpdateView):
    form_class = UserprofileForm
    model = SeevcamUser
    template_name = "profile.html"
    pjax_template_name = "profile-update.html"

    def get_template_names(self):
        if self.request.GET.get('_pjax', None) == '#container':
            self.pjax_template_name = None
        return super(UserProfileUpdate, self).get_template_names()

    def get_success_url(self):
        return reverse('profile_update', args=[self.request.user.pk])


class UserProfileNotifications(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = "profile.html"
    pjax_template_name = "profile-notifications.html"


class UserProfileSettings(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = 'profile.html'
    pjax_template_name = "profile-settings.html"
