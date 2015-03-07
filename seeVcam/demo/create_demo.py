from .create_catalogues import create_catalogues
from .create_candidates import create_candidates
from .create_job_positions import create_job_positions


def create_demo(user):
    user.delete_uploaded_files()
    catalogues = create_catalogues(user)
    candidates = create_candidates(user)
    job_positions = create_job_positions(user)
