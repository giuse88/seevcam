from django.contrib.auth.models import AbstractUser
from django.db import models
from django_countries.fields import CountryField
import pytz
from userprofile.models import UserNotifications

TIMEZONE_CHOICES = [(tz, tz) for tz in pytz.all_timezones]


class SeevcamUser(AbstractUser):
    company = models.CharField(max_length=255, null=False, blank=False)
    job_title = models.CharField(max_length=255, null=False, blank=False)
    timezone = models.CharField(max_length=255, null=False, blank=False, choices=TIMEZONE_CHOICES)
    country = CountryField()
    notifications = models.ForeignKey(UserNotifications, null=True)

    class Meta:
        db_table = "users"


