from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from common.helpers.test_helper import create_interview, create_candidate, create_job_position, create_question, \
    create_catalogue, create_user, create_company, create_uploaded_file, create_notes
from events.models import Event
import datetime


class TestEventsRESTAPI(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))
        self.interview = create_interview(self.user, self.catalogue, self.candidate, self.job_position, create_notes())
        self.url = '/dashboard/interviews/' + str(self.interview.id) + '/events/'

    def tearDown(self):
        self.user.delete()
        self.catalogue.delete()
        self.question.delete()
        self.job_position.delete()
        self.company.delete()
        self.candidate.delete()

    def test_user_can_create_a_answer_with_content(self):
        self.client.force_authenticate(user=self.user)
        answer = {"type": "RATE_UPDATED",
                  "content": {"new_rating": 3,
                              "old_rating": 6,
                              "question_id": 1},
                  "timestamp": "2014-12-31T12:52:16.00+00:00"}
        response = self.client.post(self.url, answer, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['type'], Event.RATE_UPDATED)

    def test_user_can_retrieve_a_list_of_events(self):
        self.client.force_authenticate(user=self.user)
        event = Event(pk=1,
                      interview=self.interview,
                      timestamp=datetime.datetime.now(),
                      content='{"content":"test"}',
                      type=Event.RATE_CREATED)
        event.save()
        response = self.client.get(self.url, format="json")
        print(response)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], 1)
