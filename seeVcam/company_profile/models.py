from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False, db_index=True)

    def __str__(self):
        return "{0}".format(self.name)

    class Meta:
        verbose_name = 'company'
        verbose_name_plural = 'companies'
        db_table = "companies"
