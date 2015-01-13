from unittest import skip
from django.test import Client
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from django.conf import settings

from authentication.models import SeevcamUser
from common.helpers.test_helper import create_user
from questions.models import QuestionCatalogue, Question


class QuestionCatalogueViewTests(APITestCase):

    client = None
    CATALOG_PATH = '/dashboard/questions/'
    CATALOG_PATH_CREATE = '/dashboard/questions/create/'
    CATALOG_PATH_DELETE = '/dashboard/questions/%d/delete/'
    CATALOG_PATH_UPDATE = '/dashboard/questions/%d/update/'
    QUESTION_PATH_CREATE = '/dashboard/questions/%d/create_question/'
    QUESTION_PATH_DELETE = '/dashboard/questions/%d/delete_question/%d/'
    QUESTION_PATH_UPDATE = '/dashboard/questions/%d/update_question/%d/'
    CATALOG_PATH_WITH_PRIVATE_SCOPE = CATALOG_PATH + '?scope=private'

    def setUp(self):
        self.client = Client()
        # create mock users
        self.user_1 = self._create_dummy_user('user_1', 'password')
        self.user_2 = self._create_dummy_user('user_2', 'password')
        # Create Catalogues
        QuestionCatalogueViewTests._create_catalogues(self.user_1, 10)
        QuestionCatalogueViewTests._create_catalogues(self.user_2, 5)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=1), 10)
        # QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=2), 3)
        # QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=11), 5)
        # QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=12), 6)

    @skip("Not implemented yet")
    def test_unauthenticated_user(self):
        response = self.client.get(self.CATALOG_PATH)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_access_his_catalogue_list(self):
        # user_1
        self._log_in_dummy_user('user_1', 'password')
        response = self.client.get(self.CATALOG_PATH, data={}, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.context['questioncatalogue_list']), 10)
        self.client.logout()
        #user_2
        self._log_in_dummy_user('user_2', 'password')
        response = self.client.get(self.CATALOG_PATH, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.context['questioncatalogue_list']), 5)

    def test_user_can_add_a_new_catalogue_to_his_list(self):
        self._log_in_dummy_user('user_1', 'password')
        response = self.client.post(self.CATALOG_PATH_CREATE, {'catalogue_name': 'tests'}, follow=True,
                                    HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(len(response.context['questioncatalogue_list']), 11)
        self.assertEqual(QuestionCatalogue.objects.filter(catalogue_owner=self.user_1).count(), 11)

    def test_user_can_delete_a_catalogue_from_his_list(self):
        self._log_in_dummy_user('user_1', 'password')
        self.assertEqual(Question.objects.filter(question_catalogue=1).count(), 10)
        response = self.client.post(self.CATALOG_PATH_DELETE % 1, data={}, HTTP_X_REQUESTED_WITH='XMLHttpRequest', follow=True)
        self.assertEqual(len(response.context['questioncatalogue_list']), 9)
        self.assertEqual(QuestionCatalogue.objects.filter(catalogue_owner=self.user_1).count(), 9)
        self.assertEqual(Question.objects.filter(question_catalogue=1).count(), 0)

    def test_user_can_update_a_catalogue(self):
        self._log_in_dummy_user('user_1', 'password')
        response = self.client.post(self.CATALOG_PATH_UPDATE % 1, {'catalogue_name': 'tests'}, follow=True,
                                    HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(QuestionCatalogue.objects.filter(catalogue_owner=self.user_1).count(), 10)
        self.assertEqual(len(response.context['questioncatalogue_list']), 10)
        self.assertEqual(response.context['questioncatalogue_list'][0].catalogue_name, "tests")
        updated_catalogue = QuestionCatalogue.objects.get(pk=1)
        self.assertEqual(updated_catalogue.catalogue_name, "tests")

    def test_user_can_add_a_question_in_a_catalogue(self):
        self._log_in_dummy_user('user_1', 'password')
        response = self.client.post(self.QUESTION_PATH_CREATE % 1, {'question_text': 'question'}, follow=True,
                                    HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(Question.objects.filter(question_catalogue=1).count(), 11)
        self.assertEqual(len(response.context['question_list']), 11)

    def test_user_can_delete_a_question_in_a_catalogue(self):
        self._log_in_dummy_user('user_1', 'password')
        response = self.client.post(self.QUESTION_PATH_DELETE % (1, 1),{}, follow=True,
                                    HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        print self.QUESTION_PATH_DELETE % (1, 1)
        print response
        self.assertEqual(Question.objects.filter(question_catalogue=1).count(), 9)
        self.assertEqual(len(response.context['question_list']), 9)


    def test_user_can_update_a_question_in_a_catalogue(self):
        self._log_in_dummy_user('user_1', 'password')
        response = self.client.post(self.QUESTION_PATH_UPDATE % (1, 1), {'question_text': 'question'}, follow=True,
                                    HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(Question.objects.filter(question_catalogue=1).count(), 10)
        self.assertEqual(len(response.context['question_list']), 10)
        updated_question = Question.objects.get(pk=1)
        self.assertEqual(updated_question.question_text, "question")

    # ############################################################
    #                          PRIVATE                          #
    #############################################################

    def _create_dummy_user(self, username):
        user = create_user(self.company, username, 'test')
        user.save()
        return user

    def _log_in_dummy_user(self, username, password):
        self.client.post(settings.LOGIN_URL, {'username': username, 'password': password})

    @staticmethod
    def _create_questions(catalogue, how_many):
        for i in range(how_many):
            q = Question(question_text="question text", question_catalogue=catalogue)
            q.save()

    @staticmethod
    def _create_catalogues(user, how_many, scope=QuestionCatalogue.PRIVATE_SCOPE):
        for i in range(how_many):
            q = QuestionCatalogue(catalogue_name='test_' + user.username, catalogue_owner=user,
                                  catalogue_scope=scope)
            q.save()

    def _verify_response_question_list(self, cat, how_many):
        path = self.QUESTION_PATH_LIST.format(cat)
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question_counter = 0
        for question_dict in response.data:
            question_counter += 1
            self.assertEqual(question_dict['question_catalogue'], cat)
        self.assertEqual(question_counter, how_many)

    def _verified_forbidden_access_list(self, cat):
        path = self.QUESTION_PATH_LIST.format(cat)
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def _verify_get_catalogue(self, response, user_str, how_many):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        catalogues_number = 0
        for catalogue in response.data:
            catalogues_number += 1
            self.assertEqual(catalogue['catalogue_name'], user_str)
        self.assertEqual(how_many, catalogues_number)
