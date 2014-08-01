from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.views.generic import UpdateView
from authentication.models import SeevcamUser
from django.shortcuts import render, redirect
from userprofile.forms import UserprofileForm, NotificationForm
from userprofile.models import UserNotifications


class UserProfileView(TemplateView):
    template_name = 'profile.html'

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(UserProfileView, self).dispatch(*args, **kwargs)


class UserProfileUpdate(UpdateView):
    form_class = UserprofileForm
    model = SeevcamUser
    # user_id = self.request
    # success_url = '/dashboard/profile/'
    # fields = ['username', 'email', 'first_name', 'last_name', 'job_title', 'picture']
    template_name = 'profile_update.html'

    def get_object(self, *args, **kwargs):
        obj = super(UserProfileUpdate, self).get_object(*args, **kwargs)
        if not obj == self.request.user:
            raise Http404
        return obj


    def get_success_url(self):
        success_url = '/dashboard/profile/' + str(self.request.user.pk) + '/update/'
        return success_url


class UserProfileNotifications(UpdateView):
    form_class = NotificationForm
    model = UserNotifications
    template_name = 'profile_notifications.html'


class UserProfileSettings(TemplateView):
    template_name = 'registration/password_change_form.html'