from datetime import timedelta, datetime
import os
import random
import yaml
from common.helpers.test_helper import create_question, create_answer
from .create_catalogues import create_catalogue
from events.models import Event

BASE = os.path.dirname(os.path.abspath(__file__))


def select_question(report, question, delta):
    content = '{"question_id":%d}' % question.id
    print(report.start)
    start = datetime.strptime(report.start, "%Y-%m-%dT%H:%M:%S.%f%z")
    timestamp = start + timedelta(seconds=delta)
    event = Event(timestamp=timestamp, interview=report, type=Event.QUESTION_SELECTED, content=content)
    event.save()


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


def create_events_for_reports(report, questions):
    delta = 100
    for question in questions:
        select_question(report, question, delta)
        delta += 30


def create_answers(user, reports):
    catalogue = create_catalogue("Questions for Mechanical engineer", user)
    document = open(os.path.join(BASE, 'fixtures/answers.yml'), 'r')
    answers = yaml.load(document)
    questions = []

    for answer in answers:
        questions.append(create_question(catalogue, answer["question"]))

    for report in reports:
        create_answers_for_report(report, catalogue, questions, answers)
        create_events_for_reports(report, questions)
