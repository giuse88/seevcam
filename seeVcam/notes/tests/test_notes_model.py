from django.test import TestCase

from common.helpers.test_helper import create_interview_model
from notes.models import Notes


class TestNotes(TestCase):
    def set_up(self):
        pass

    def test_creation_notes_model(self):
        interview = create_interview_model()
        notes = Notes(pk=1, text_content="text content", interview=interview)
        notes.save()
        notes_from_db = Notes.objects.get(pk=1)
        self.assertEqual(notes.text_content, notes_from_db.text_content, "Comparing text content")
        self.assertEqual(notes.interview, notes_from_db.interview, "Comparing interview object")

