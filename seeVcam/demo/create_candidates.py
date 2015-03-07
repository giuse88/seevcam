import os
import yaml
from common.helpers.test_helper import create_candidate

from .uploaded_files import upload_cv


BASE = os.path.dirname(os.path.abspath(__file__))


def parse_name(name):
    tokens = name.split(" ")
    email = tokens[0] + tokens[1] + "@info.com"
    return tokens[0], tokens[1], email.lower()


def load_candidate(user, full_name, cv):
    first_name, second_name, email = parse_name(full_name)
    return create_candidate(user, user.company, cv, first_name, second_name, email)


def create_candidates(user):
    user.delete_candidates()
    document = open(os.path.join(BASE, 'fixtures/candidates.yml'), 'r')
    candidates = []
    for full_name in yaml.load(document):
        cv = upload_cv(user)
        candidates.append(load_candidate(user, full_name, cv))
    return candidates