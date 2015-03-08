import random
import datetime

from common.helpers.test_helper import create_interview
from demo.create_answers import create_answers
from demo.create_overall_rating import create_overall_ratings
from interviews.models import Interview
from .create_notes import create_notes


SATURDAY = 6
SUNDAY = 7
DAYS_TO_BE_POPULATED = 10
INTERVIEWS_PER_DAY = 7

valid_interview_slots = [
    ('09:00:00.000000+00:00', '10:00:00.000000+00:00'),
    ('10:00:00.000000+00:00', '10:30:00.000000+00:00'),
    ('10:30:00.000000+00:00', '11:00:00.000000+00:00'),
    ('11:00:00.000000+00:00', '12:00:00.000000+00:00'),
    ('12:00:00.000000+00:00', '12:30:00.000000+00:00'),
    ('12:30:00.000000+00:00', '13:00:00.000000+00:00'),
    ('13:00:00.000000+00:00', '13:30:00.000000+00:00'),
    ('13:30:00.000000+00:00', '14:00:00.000000+00:00'),
    ('14:00:00.000000+00:00', '15:00:00.000000+00:00'),
    ('15:00:00.000000+00:00', '15:30:00.000000+00:00'),
    ('15:30:00.000000+00:00', '16:00:00.000000+00:00'),
    ('16:00:00.000000+00:00', '17:00:00.000000+00:00'),
    ('17:00:00.000000+00:00', '17:30:00.000000+00:00'),
    ('18:00:00.000000+00:00', '19:00:00.000000+00:00')
]


def generate_random_index():
    interview_slot_index = []
    for x in range(0, INTERVIEWS_PER_DAY):
        num = random.randint(0, len(valid_interview_slots) - 1)
        while num in interview_slot_index:
            num = random.randint(0, len(valid_interview_slots) - 1)
        interview_slot_index.append(num)
    return interview_slot_index


def weekdays_generator(how_many_days, delta_days=1):
    next = datetime.date.today()
    counter = 0
    while counter < how_many_days:
        weekday = next.isoweekday()
        if weekday != SATURDAY and weekday != SUNDAY:
            yield next
            counter += 1
        next = next + datetime.timedelta(days=delta_days)


def generate_candidate(candidates):
    candidate = candidates[generate_candidate.index]
    generate_candidate.index += 1
    return candidate


def populate_interviews(user, catalogues, candidates, job_positions, is_report=False):
    interviews = []

    def load_interview(day, time_slot):
        job_position = job_positions[random.randint(0, len(job_positions) - 1)]
        catalogue = catalogues[random.randint(0, len(catalogues) - 1)]
        candidate = generate_candidate(candidates)
        status = Interview.CLOSED if is_report else Interview.OPEN
        formatted_day = day.strftime('%Y-%m-%d')
        start = "%sT%s" % (formatted_day, time_slot[0])
        end = "%sT%s" % (formatted_day, time_slot[1])
        interviews.append(create_interview(user, catalogue, candidate, job_position, start, end, status))

    def load_interviews_for_day(day):
        for index in generate_random_index():
            load_interview(day, valid_interview_slots[index])

    def load_interviews():
        delta = -1 if is_report else 1
        for day in weekdays_generator(DAYS_TO_BE_POPULATED, delta):
            load_interviews_for_day(day)

    load_interviews()
    return interviews


def create_interviews(user, catalogues, candidates, job_positions):
    generate_candidate.index = 0
    return populate_interviews(user, catalogues, candidates, job_positions)


def create_reports(user, catalogues, candidates, job_positions):
    generate_candidate.index = 0
    reports = populate_interviews(user, catalogues, candidates, job_positions, True)
    create_answers(user, reports)
    create_notes(reports)
    create_overall_ratings(reports)
    return reports
