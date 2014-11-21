from django.db import models


class UserNotifications(models.Model):
    notification_when_room_is_open = models.BooleanField(default=True, blank=False, null=False)
    notification_day_before = models.BooleanField(default=False, blank=False, null=False)
    notification_hour_before = models.BooleanField(default=False, blank=False, null=False)

    class Meta:
        db_table = 'user_notifications'


class UserIntegration(models.Model):
    class Meta:
        db_table = 'user_applications'
