import os

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings
from django_countries.fields import CountryField
import pytz


def get_avatar_path(instance, filename):
    user_pk = instance.pk
    filename = "%s" % (user_pk)
    filename = os.path.join('profile_pictures', filename)
    fullname = os.path.join(settings.MEDIA_ROOT, filename)
    print fullname
    if os.path.exists(fullname):
        os.remove(fullname)
    return filename


TIMEZONE_CHOICES = [(tz, tz) for tz in pytz.all_timezones]


class SeevcamUser(AbstractUser):
    job_title = models.CharField(max_length=255, null=False, blank=False)
    pic = models.ImageField(upload_to=get_avatar_path,
                            error_messages={'invalid': "you can upload image files only"}, null=True, blank=True,
                            default='profile_pictures/no-profile-img.gif')
    timezone = models.CharField(max_length=255, null=False, blank=False, choices=TIMEZONE_CHOICES)
    country = CountryField()

