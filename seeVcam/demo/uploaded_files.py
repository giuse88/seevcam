import os
from django.core.files import File
from common.helpers import test_helper as utils

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


def open_file(relative_path):
    return File(open(os.path.join(BASE_DIR, relative_path), 'rb'))


def upload_cv(user):
    cv = open_file("fixtures/files/cv.pdf")
    return utils.create_uploaded_file(user, cv, "cv")


def upload_job_spec(user):
    job = open_file("fixtures/files/job.pdf")
    return utils.create_uploaded_file(user, job, "jobSpec")


def file_upload(user):
    user.delete_uploaded_files()
    return upload_cv(user), upload_job_spec(user)

