from django.test import TestCase
from common.helpers.test_helper import create_company, create_user, create_catalogue, create_question, \
    create_job_position, create_candidate, create_interview, create_uploaded_file, create_notes

from notes.models import Notes


class TestNotes(TestCase):

    def setUp(self):
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))

    def tearDown(self):
        self.user.delete()
        self.catalogue.delete()
        self.question.delete()
        self.job_position.delete()
        self.company.delete()
        self.candidate.delete()

    def test_creation_notes_model(self):
        notes = Notes(pk=1, content="text content")
        notes.save()
        # I am creating the interview here so that the notes object gets a reference to interview object
        create_interview(self.user, self.catalogue, self.candidate, self.job_position, notes)
        notes_from_db = Notes.objects.get(pk=1)
        self.assertEqual(notes.content, notes_from_db.content, "Comparing text content")
        self.assertEqual(notes.interview, notes_from_db.interview, "Comparing interview object")

