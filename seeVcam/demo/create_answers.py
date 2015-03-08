import os
import random
from datetime import timedelta, datetime

import yaml
from django.conf import settings

from events.models import Event
from .create_catalogues import create_catalogue
from common.helpers.test_helper import create_question, create_answer


BASE = os.path.dirname(os.path.abspath(__file__))


def select_question(report, question, delta):
    content = '{"question_id":%d}' % question.id
    start = datetime.strptime(report.start, settings.DATE_INPUT_FORMATS[0])
    timestamp = start + timedelta(seconds=delta)
    event = Event(timestamp=timestamp, interview=report, type=Event.QUESTION_SELECTED, content=content)
    event.save()


def rate_created(report, question, delta):
    rate = random.randint(1, 9)
    content = '{"rating":%d, "question_id":%d}' % (question.id, rate)
    start = datetime.strptime(report.start, settings.DATE_INPUT_FORMATS[0])
    timestamp = start + timedelta(seconds=delta)
    event = Event(timestamp=timestamp, interview=report, type=Event.RATE_CREATED, content=content)
    event.save()
    return rate


def rate_updated(rate, report, question, delta):
    content = '{"new_rating":%d,"old_rating":%d, "question_id":%d}' \
              % (question.id, random.randint(1, 9), rate)
    start = datetime.strptime(report.start, settings.DATE_INPUT_FORMATS[0])
    timestamp = start + timedelta(seconds=delta)
    event = Event(timestamp=timestamp, interview=report, type=Event.RATE_UPDATED, content=content)
    event.save()
    return event


def create_answers_for_report(report, catalogue, questions, answers):
    saved_answers = []
    for answer in answers:
        saved_answers.append(create_answer(report,
                                           questions[answer["question_index"]],
                                           answer["content"],
                                           answer["rating"]))
    report.overall_score = random.randint(40, 99) / 10
    report.catalogue = catalogue
    report.save()


def create_events_for_reports(report, questions):
    delta = 100
    for question in questions:
        select_question(report, question, delta)
        rate = rate_created(report, question, delta + 40)
        rate_updated(rate, report, question, delta + 90)
        delta += 100


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
