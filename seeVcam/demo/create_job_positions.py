import os
import yaml
from common.helpers.test_helper import create_job_position
from .uploaded_files import upload_job_spec


BASE = os.path.dirname(os.path.abspath(__file__))


def load_position(user, position, job_spec):
    return create_job_position(user, user.company, job_spec, position)


def create_job_positions(user):
    user.delete_candidates()
    document = open(os.path.join(BASE, 'fixtures/job_positions.yml'), 'r')
    job_positions = []
    for position in yaml.load(document):
        job = upload_job_spec(user)
        job_positions.append(load_position(user, position, job))
    return job_positions

