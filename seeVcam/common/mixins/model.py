from django.db import models
from django.conf import settings

from company_profile.models import Company


class UpdateCreateTimeStamp(models.Model):
    added_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class CompanyInfo(models.Model):
    company = models.ForeignKey(Company, null=False, blank=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False, db_column='created_by')

    class Meta:
        abstract = True
