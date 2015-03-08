import os
import yaml
from common.helpers.test_helper import create_candidate, create_catalogue, create_question, create_answer

from .uploaded_files import upload_cv


BASE = os.path.dirname(os.path.abspath(__file__))


def create_answers(report, ):
    user = report.owner
    catalogue = create_catalogue(user, "Question for Junior Software engineer")
    document = open(os.path.join(BASE, 'fixtures/answers.yml'), 'r')
    answers = []
    for answer in yaml.load(document):
        question = create_question(catalogue, answer["question"])
        create_answer(report, question, answer["content"], answer["rating"])


    return answers