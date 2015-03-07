from .uploaded_files import file_upload
from .create_catalogues import create_catalogues


def create_demo(user):
    cv, job = file_upload(user)
    catalogues = create_catalogues(user)


