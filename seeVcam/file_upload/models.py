import os
from django.db import models
from django.conf import settings


def upload_to_user_folder(instance, filename):
    user_id = str(instance.created_by.id)
    folder_name = str(instance.type)
    return os.path.join(settings.SEEVCAM_UPLOAD_FILE_FOLDER, user_id, folder_name, filename)


def upload_cv(instance, filename):
    return upload_to_user_folder(instance, 'cv', filename)


def upload_job_spec(instance, filename):
    return upload_to_user_folder(instance, 'jobSpec', filename)


class UploadedFileManager(models.Manager):

    def create_uploaded_file(self, raw_file, user):
        uploaded_file = self.create(file=raw_file, size=raw_file.size, created_by=user,
                                    name=raw_file.name, url='url', delete_url='delete_url')
        return uploaded_file


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

    objects = UploadedFileManager()



