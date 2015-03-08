import os
import yaml
from common.helpers import test_helper


BASE = os.path.dirname(os.path.abspath(__file__))


def create_notes(reports):
    document = open(os.path.join(BASE, 'fixtures/notes.yml'), 'r')
    notes = yaml.load(document)["notes"]
    print(notes)
    for report in reports:
        test_helper.create_notes(report, notes)
    return notes