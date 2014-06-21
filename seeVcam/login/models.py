from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext_lazy as _
from allauth.account.models import EmailAddress

class SeevUser(AbstractUser):
    company = models.CharField(_("company"), max_length=200, null=True, blank=True)

    def account_verified(self):
        if self.is_authenticated:
            result = EmailAddress.objects.filter(email=self.email)
            if len(result):
                return result[0].verified
        return False

