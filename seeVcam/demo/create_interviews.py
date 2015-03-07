import random
import datetime

from common.helpers.test_helper import create_interview
from demo.create_candidates import create_candidates
from demo.create_catalogues import create_catalogues
from demo.create_job_positions import create_job_positions

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


def weekdays_generator(how_many_days):
    next = datetime.date.today()
    counter = 0
    while counter < how_many_days:
        weekday = next.isoweekday()
        if weekday != SATURDAY and weekday != SUNDAY:
            yield next
            counter += 1
        next = next + datetime.timedelta(days=1)


def generate_candidate(candidates):
    if not hasattr(generate_candidate, "index"):
        generate_candidate.index = 0
    candidate = candidates[generate_candidate.index]
    generate_candidate.index += 1
    return candidate


def create_interviews(user):
    user.delete_interviews()
    catalogues = create_catalogues(user)
    candidates = create_candidates(user)
    job_positions = create_job_positions(user)

    def load_interview(day, time_slot):
        job_position = job_positions[random.randint(0, len(job_positions) - 1)]
        catalogue = catalogues[random.randint(0, len(catalogues) - 1)]
        candidate = generate_candidate(candidates)
        formatted_day = day.strftime('%Y-%m-%d')
        start = "%sT%s" % (formatted_day, time_slot[0])
        end = "%sT%s" % (formatted_day, time_slot[1])
        create_interview(user, catalogue, candidate, job_position, start, end)

    def load_interviews_for_day(day):
        for index in generate_random_index():
            load_interview(day, valid_interview_slots[index])

    def load_interviews():
        for day in weekdays_generator(DAYS_TO_BE_POPULATED):
            load_interviews_for_day(day)

    load_interviews()
