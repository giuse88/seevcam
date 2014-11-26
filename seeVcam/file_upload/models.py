from django.db import models
from django.conf import settings
from common.helpers.file_upload import upload_to_user_folder


class UploadedFile(models.Model):
    file = models.FileField(blank=False, null=False, upload_to=upload_to_user_folder)
    type = models.CharField(max_length=250, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False, db_column='created_by')
    name = models.CharField(max_length=250, blank=False, null=False)
    size = models.PositiveIntegerField(blank=False, null=False)
    url = models.URLField(blank=False, null=False, unique=True)
    delete_url = models.URLField(blank=False, null=False)
    delete_type = models.CharField(max_length=50, null=False, blank=False, default='DELETE')
    upload_type = models.CharField(max_length=50, null=False, blank=False, default='POST')
