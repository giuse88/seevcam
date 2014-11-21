from django.forms import ModelForm
from authentication.models import SeevcamUser
from userprofile.models import UserNotifications


class UserProfileForm(ModelForm):
    class Meta:
        model = SeevcamUser
        fields = ['username', 'email', 'first_name', 'last_name', 'job_title', 'country', 'timezone', 'company']


class NotificationForm(ModelForm):
    class Meta:
        model = UserNotifications
        fields = ['notification_when_room_is_open', 'notification_day_before', 'notification_hour_before']
