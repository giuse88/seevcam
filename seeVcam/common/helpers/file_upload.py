import os
from django.conf import settings


def upload_to_user_folder(instance, folder_name, filename):
    user_id = str(instance.interview_owner.id)
    return os.path.join(settings.MEDIA_ROOT, user_id, str(instance.id), folder_name, filename)


def upload_cv(instance, filename):
    return upload_to_user_folder(instance, 'cv', filename)


def upload_job_spec(instance, filename):
    return upload_to_user_folder(instance, 'job', filename)

