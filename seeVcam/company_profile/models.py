from django.db import models


class Company(models.Model):

    company = models.CharField(max_length=255, null=False, blank=False, db_index=True, primary_key=True)

    class Meta:
        db_table = "companies"
