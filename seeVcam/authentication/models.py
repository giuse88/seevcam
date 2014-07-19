from django.contrib.auth.models import AbstractUser
from django.db import models


class SeevcamUser(AbstractUser):
    job_title = models.CharField(max_length=255, null=False, blank=False)