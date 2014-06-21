from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _


class SeevUser(AbstractUser):
    company = models.CharField(_("company"), max_length=200, null=True, blank=True)
