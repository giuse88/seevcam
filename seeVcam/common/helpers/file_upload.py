import os
from django.conf import settings

def upload_to_user_folder(instance, folder_name):
    user_id = str(instance.interview_owner.id)
    user_folder = os.path.join(settings.MEDIA_ROOT, user_id)
    if not os.path.exists(user_folder):
        os.makedirs(user_folder)
    dest_folder = os.path.join(user_folder, folder_name)
    if not os.path.exists(dest_folder):
        os.makedirs(dest_folder)
    return dest_folder


def upload_cv(instance, filename):
    return upload_to_user_folder(instance, 'cv')

def upload_job_spec(instance, filename):
    return upload_to_user_folder(instance, 'job')

def upload_img(instance, filename):
    return upload_to_user_folder(instance, 'img')
