from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.generic import UpdateView
from authentication.models import SeevcamUser


class UserProfileView(TemplateView):
    template_name = 'profile.html'

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(UserProfileView, self).dispatch(*args, **kwargs)


class UserProfileUpdate(UpdateView):
    model = SeevcamUser
    fields = ['username', 'email', 'first_name', 'last_name', 'job_title']
    template_name = 'profile_update.html'

    def get_object(self, *args, **kwargs):
        obj = super(UserProfileUpdate, self).get_object(*args, **kwargs)
        if not obj == self.request.user:
            raise Http404
        return obj


class UserProfileSettings(TemplateView):
    template_name = 'profile_setting.html'