from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from common.helpers.test_helper import create_user, create_company, create_catalogue, create_question, \
    create_job_position, create_uploaded_file, create_candidate, create_interview,\
    create_overall_rating_question, create_overall_rating


class TestAnswer(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))
        self.interview = create_interview(self.user, self.catalogue, self.candidate, self.job_position)
        self.overall_rating = create_overall_rating(self.interview, create_overall_rating_question())
        self.url = '/dashboard/interviews/' + str(self.interview.id) + '/overall_ratings/'

    def tearDown(self):
        self.user.delete()
        self.catalogue.delete()
        self.question.delete()
        self.job_position.delete()
        self.company.delete()
        self.candidate.delete()
        self.interview.delete()

    def test_user_can_retrieve_overall_rating_for_an_interview(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], 1)
        self.assertEqual(response.data[0]['rating'], 1)
        self.assertEqual(response.data[0]['question'], "this is a question for overall rating")

    def test_user_can_set_overall_rating_for_an_interview(self):
        self.client.force_authenticate(user=self.user)
        rating = {'id': 1, 'rating': 5, 'question': 'this is a question for overall rating'}
        response = self.client.put(self.url + str(self.overall_rating.id) + "/", rating, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], 1)
        self.assertEqual(response.data['question'], "this is a question for overall rating")
        self.assertEqual(response.data['rating'], 5)
