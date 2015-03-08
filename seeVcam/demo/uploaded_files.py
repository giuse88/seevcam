import os
from django.core.files import File
from common.helpers import test_helper as utils

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


def open_file(relative_path):
    return File(open(os.path.join(BASE_DIR, relative_path), 'rb'))


def upload_cv(user):
    cv = open_file("fixtures/files/cv.pdf")
    uploaded_file = utils.create_uploaded_file(user, cv, "cv")
    uploaded_file.original_name = "CurriculumVitae.pdf"
    uploaded_file.save()
    return uploaded_file


def upload_job_spec(user):
    job = open_file("fixtures/files/job.pdf")
    uploaded_file = utils.create_uploaded_file(user, job, "jobSpec")
    uploaded_file.original_name = "JobPosition.pdf"
    uploaded_file.save()
    return uploaded_file


def file_upload(user):
    return upload_cv(user), upload_job_spec(user)

