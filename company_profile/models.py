from django.db import models


class Company(models.Model):

    name = models.CharField(max_length=255, null=False, blank=False, db_index=True)

    class Meta:
        verbose_name = 'company'
        verbose_name_plural = 'companies'
        db_table = "companies"
