from django.db import models
from authentication.models import SeevcamUser

class UserNotifications(models.Model):
    user = models.ForeignKey(SeevcamUser)
    notification_15 = models.BooleanField()
    notification_60 = models.BooleanField()