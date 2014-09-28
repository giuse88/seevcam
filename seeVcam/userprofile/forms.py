from django.forms import ModelForm
from authentication.models import SeevcamUser
from userprofile.models import UserNotifications


class UserprofileForm(ModelForm):
    class Meta:
        model = SeevcamUser
        fields = ['username', 'email', 'first_name', 'last_name', 'job_title', 'pic', 'country', 'timezone',]


class NotificationForm(ModelForm):
    class Meta:
        model = UserNotifications
        fields = ['notification_15','notification_60']