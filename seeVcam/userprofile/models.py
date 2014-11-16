from django.db import models


class UserNotifications(models.Model):
    notification_when_room_is_open = models.BooleanField()
    notification_day_before = models.BooleanField()

    class Meta:
        db_table = 'user_notifications'


class UserIntegration(models.Model):
    class Meta:
        db_table = 'user_applications'
