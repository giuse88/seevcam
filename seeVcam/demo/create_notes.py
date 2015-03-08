import os
from common.helpers import test_helper


BASE = os.path.dirname(os.path.abspath(__file__))


def create_notes(reports):
    document = open(os.path.join(BASE, 'fixtures/notes.html'), 'r')
    notes = document.read()
    for report in reports:
        test_helper.create_notes(report, notes.replace("XXXXX", report.candidate.name))
    return notes