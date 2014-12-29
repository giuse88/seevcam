from django.db import models


class Notes(models.Model):
    content = models.TextField(null=False, blank=True, default='')

    class Meta:
        verbose_name = 'notes'
        verbose_name_plural = 'notes'
        db_table = "notes"

