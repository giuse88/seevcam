from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from common.helpers.test_helper import create_company, create_user, create_catalogue, create_question, \
    create_job_position, create_candidate, create_interview, create_uploaded_file, create_answer


class TestAnswerRESTAPI(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))
        self.interview = create_interview(self.user, self.catalogue, self.candidate, self.job_position)
        self.url = '/dashboard/interviews/' + str(self.interview.id) + '/answers/'

    def tearDown(self):
        self.user.delete()
        self.catalogue.delete()
        self.question.delete()
        self.job_position.delete()
        self.company.delete()
        self.candidate.delete()
        self.interview.delete()

    def test_user_can_create_a_answer(self):
        pass
        # update = {"content": "answer", "question_id",   }
        # response = self.client.put(self.NOTE_URL.format(self.interview.id), update, format="json")
        # self.assertEqual(response.status_code, status.HTTP_200_OK)
        # self.assertEqual(response.data['text_content'], "update")

    def test_user_can_retrieve_answers_for_a_interview(self):
        answer = create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['question'], self.question.id)
        self.assertEqual(response.data[0]['content'], "answer")
        answer.delete()
