from django.db import models
from django.conf import settings


class Interview(models.Model):
    interview_owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, )
    is_interview_open = models.BooleanField(null=False, blank=False)

