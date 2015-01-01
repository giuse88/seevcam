from django.db import models
from interviews.models import Interview


class Notes(models.Model):

    content = models.TextField(null=False, blank=True, default='')
    interview = models.OneToOneField(Interview, null=False, blank=False, db_column='interview_id')

    class Meta:
        verbose_name = 'notes'
        verbose_name_plural = 'notes'
        db_table = "notes"

