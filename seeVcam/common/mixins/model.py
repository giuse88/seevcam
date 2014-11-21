from django.db import models
from django.conf import settings
from company_profile.models import Company


class UpdateCreateTimeStamp(object):
    added = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)


class CompanyInfo(object):
    company = models.ForeignKey(Company, null=False, blank=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False)
