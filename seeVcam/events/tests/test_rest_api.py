from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from common.helpers.test_helper import create_interview, create_candidate, create_job_position, create_question, \
    create_catalogue, create_user, create_company, create_uploaded_file
from notes.models import Notes


class TestNotesRESTAPI(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))
        notes = Notes(pk=1, content="content")
        notes.save()
        self.interview = create_interview(self.user, self.catalogue, self.candidate, self.job_position, notes)
        self.url = '/dashboard/interviews/' + str(self.interview.id) + '/notes/'

    def tearDown(self):
        self.user.delete()
        self.catalogue.delete()
        self.question.delete()
        self.job_position.delete()
        self.company.delete()
        self.candidate.delete()

