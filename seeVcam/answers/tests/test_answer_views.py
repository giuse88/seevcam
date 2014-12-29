from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from answers.models import Answer

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

    def test_user_can_create_a_answer_with_content(self):
        self.client.force_authenticate(user=self.user)
        answer = {"content": "create", "question": 1}
        response = self.client.post(self.url, answer, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], "create")
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['rating'], None)

    def test_user_can_create_a_answer_with_rating(self):
        self.client.force_authenticate(user=self.user)
        answer = {"rating": 1, "question": 1}
        response = self.client.post(self.url, answer, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['content'], None)
        self.assertEqual(response.data['rating'], 1)

    def test_user_can_create_a_answer(self):
        self.client.force_authenticate(user=self.user)
        answer = {"content": "create", "rating": 1, "question": 1}
        response = self.client.post(self.url, answer, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['content'], "create")
        self.assertEqual(response.data['rating'], 1)

    def test_user_can_retrieve_answers_for_a_interview(self):
        create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['question'], self.question.id)
        self.assertEqual(response.data[0]['content'], "answer")

    def test_user_can_update_rating_put(self):
        answer = create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.url + str(answer.id) + '/', {"rating": 1, "question": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['content'], "answer")
        self.assertEqual(response.data['rating'], 1)

    def test_user_can_update_rating_patch(self):
        answer = create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.url + str(answer.id) + '/', {"rating": 1}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['content'], "answer")
        self.assertEqual(response.data['rating'], 1)

    def test_user_can_update_content_put(self):
        answer = create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.url + str(answer.id) + '/', {"content": "updated", "question": 1},
                                   format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['content'], "updated")

    def test_user_can_update_content_patch(self):
        answer = create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(self.url + str(answer.id) + '/', {"content": "updated"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['content'], "updated")

    def test_user_can_update_content_and_rating(self):
        answer = create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.put(self.url + str(answer.id) + '/', {"content": "updated", "rating": 1, "question": 1},
                                   format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['content'], "updated")
        self.assertEqual(response.data['rating'], 1)

    def test_user_can_retrieve_answer_detail(self):
        answer = create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url + str(answer.id) + '/', format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['question'], self.question.id)
        self.assertEqual(response.data['content'], "answer")

    def test_user_can_delete_answer(self):
        answer = create_answer(self.interview, self.question, "answer")
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(self.url + str(answer.id) + '/', format="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(Answer.objects.all()), 0)
