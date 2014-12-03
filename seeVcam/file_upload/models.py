import os

from django.db import models
from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

_UNSAVED_FILEFIELD = 'unsaved_filefield'


def normalize_name(instance, filename):
    fn, ext = os.path.splitext(filename)
    normalized_file_name = "{type}_{pk}{ext}".format(type=instance.type, pk=instance.pk, ext=ext)
    return normalized_file_name


def upload_to_user_folder(instance, filename):
    user_id = str(instance.created_by.id)
    folder_name = str(instance.type)
    normalized_file_name = normalize_name(instance, filename)
    folder = os.path.join(settings.SEEVCAM_UPLOAD_FILE_FOLDER, user_id, folder_name, normalized_file_name)
    return folder


def upload_cv(instance, filename):
    return upload_to_user_folder(instance, 'cv', filename)


def upload_job_spec(instance, filename):
    return upload_to_user_folder(instance, 'jobSpec', filename)


class UploadedFileManager(models.Manager):
    def create_uploaded_file(self, raw_file, user, file_type=""):
        uploaded_file = self.create(file=raw_file, type=file_type, size=raw_file.size, created_by=user,
                                    name=raw_file.name, original_name=raw_file.name)
        return uploaded_file


class UploadedFile(models.Model):
    file = models.FileField(blank=False, null=False, upload_to=upload_to_user_folder)
    type = models.CharField(max_length=250, blank=False, null=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=False, blank=False, db_column='created_by')
    name = models.CharField(max_length=250, blank=False, null=False)
    original_name = models.CharField(max_length=250, blank=False, null=False)
    size = models.PositiveIntegerField(blank=False, null=False)
    url = models.URLField(blank=False, null=False, unique=True)
    delete_url = models.URLField(blank=False, null=False, unique=True)
    delete_type = models.CharField(max_length=50, null=False, blank=False, default='DELETE')
    upload_type = models.CharField(max_length=50, null=False, blank=False, default='POST')

    objects = UploadedFileManager()

    class Meta:
        db_table = "uploaded_files"

    def get_absolute_url(self):
        return os.path.join(settings.SEEVCAM_UPLOAD_FILE_FOLDER_URL, str(self.created_by.id)
                            , str(self.type), str(self.name))

    def get_delete_url(self):
        from django.core.urlresolvers import reverse_lazy
        return reverse_lazy('file_delete', kwargs={'pk': str(self.id)})



@receiver(pre_save, sender=UploadedFile)
def skip_saving_file(sender, instance, **kwargs):
    if not instance.pk and not hasattr(instance, _UNSAVED_FILEFIELD):
        print instance.name
        setattr(instance, _UNSAVED_FILEFIELD, instance.file)
        instance.file = None


@receiver(post_save, sender=UploadedFile)
def save_file(sender, instance, created, **kwargs):
    if created and hasattr(instance, _UNSAVED_FILEFIELD):
        instance.file = getattr(instance, _UNSAVED_FILEFIELD)
        instance.name = normalize_name(instance, instance.name)
        instance.url = UploadedFile.get_absolute_url(instance)
        instance.delete_url = instance.get_delete_url()
        instance.save()
        instance.__dict__.pop(_UNSAVED_FILEFIELD)
