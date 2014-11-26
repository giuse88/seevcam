import os
from django.conf import settings


def upload_to_user_folder(instance, filename):
    user_id = str(instance.created_by.id)
    folder_name = str(instance.type)
    return os.path.join(settings.MEDIA_ROOT, user_id, folder_name, filename)


def upload_cv(instance, filename):
    return upload_to_user_folder(instance, 'cv', filename)


def upload_job_spec(instance, filename):
    return upload_to_user_folder(instance, 'jobSpec', filename)

