from demo.create_answers import create_answers
from demo.create_candidates import create_candidates
from demo.create_catalogues import create_catalogues
from demo.create_interviews import create_interviews, create_reports
from demo.create_job_positions import create_job_positions


def create_demo(user):
    # user.delete_uploaded_files()
    # catalogues = create_catalogues(user)
    # candidates = create_candidates(user)
    # job_positions = create_job_positions(user)
    # create_interviews(user, catalogues, candidates, job_positions)
    # create_reports(user, catalogues, candidates, job_positions)
    create_answers(None)

