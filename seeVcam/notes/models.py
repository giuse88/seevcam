from django.db import models


class Notes(models.Model):
    text_content = models.TextField(null=False, blank=True, default='')

