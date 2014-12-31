from django.test import TestCase
import datetime
from common.helpers.test_helper import create_company, create_user, create_catalogue, create_question, \
    create_job_position, create_candidate, create_interview, create_uploaded_file, create_notes
from events.models import Event


class TestNotes(TestCase):

    def setUp(self):
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))
        self.interview = create_interview(self.user, self.catalogue, self.candidate, self.job_position, create_notes())

    def tearDown(self):
        self.user.delete()
        self.catalogue.delete()
        self.question.delete()
        self.job_position.delete()
        self.company.delete()
        self.candidate.delete()

    def test_creation_notes_model(self):
        event = Event(pk=1,
                      interview=self.interview,
                      timestamp=datetime.datetime.now(),
                      content='{"content":"test"}',
                      type=Event.RATE_CREATED)
        event.save()
        event_from_db = Event.objects.get(pk=1)
        self.assertEqual(event.interview, event_from_db.interview, "Comparing interview object")
        self.assertEqual(event.type, event_from_db.type, "Comparing type content")
        self.assertJSONEqual(event.content, event_from_db.content, "Comparing content")


