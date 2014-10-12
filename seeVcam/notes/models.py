from django.db import models

from interviews.models import Interview


class Notes(models.Model):
    text_content = models.TextField(max_length=1000, null=False, blank=True, default='')
    interview = models.ForeignKey(Interview, null=True, blank=True)

