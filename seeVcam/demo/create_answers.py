import os
import random
import yaml
from common.helpers.test_helper import create_catalogue, create_question, create_answer

BASE = os.path.dirname(os.path.abspath(__file__))


def create_answers_for_report(report, catalogue, questions, answers):
    saved_answers = []
    for answer in answers:
        saved_answers.append(create_answer(report,
                                           questions[answer["question_index"]],
                                           answer["content"],
                                           answer["rating"]))
    report.overall_score = random.randint(40, 99)/10
    report.catalogue = catalogue
    report.save()


def create_answers(user, reports):
    catalogue = create_catalogue(user, "Questions for Junior Software engineer")
    document = open(os.path.join(BASE, 'fixtures/answers.yml'), 'r')
    answers = yaml.load(document)
    questions = []

    for answer in answers:
        questions.append(create_question(catalogue, answer["question"]))

    for report in reports:
        create_answers_for_report(report, catalogue, questions, answers)
