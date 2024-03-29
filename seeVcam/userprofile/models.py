from django.db import models


class UserNotifications(models.Model):
    notification_when_room_is_open = models.BooleanField(default=True, blank=False, null=False)
    notification_day_before = models.BooleanField(default=False, blank=False, null=False)
    notification_hour_before = models.BooleanField(default=False, blank=False, null=False)

    class Meta:
        verbose_name = 'user_notifications'
        verbose_name_plural = 'user_notifications'
        db_table = 'user_notifications'

    def __str__(self):
        username = self.user_notification_settings.get_full_name()
        return "{0}'s notifications".format(username)


class UserApplications(models.Model):
    class Meta:
        verbose_name = 'user_applications'
        verbose_name_plural = 'user_applications'
        db_table = 'user_applications'
