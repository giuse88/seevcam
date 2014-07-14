from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory, APIClient

from login.models import SeevUser
from questions.models import QuestionCatalogue, Question


class QuestionCatalogueViewTests(APITestCase):
    factory = None
    client = None

    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.CATALOG_PATH = '/questions/catalogue/'
        self.QUESTION_PATH_LIST = '/questions/catalogue/{0}/list/'
        self.QUESTION_PATH_DETAILS = '/questions/catalogue/{0}/list/{1}/'
        self.user_1 = QuestionCatalogueViewTests._create_user('user_1')
        self.user_2 = QuestionCatalogueViewTests._create_user('user_2')
        QuestionCatalogueViewTests._create_catalogues(self.user_1, 10)
        QuestionCatalogueViewTests._create_catalogues(self.user_2, 5)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=1), 10)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=2), 3)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=11), 5)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=12), 6)

    def test_unauthenticated_user(self):
        response = self.client.get(self.CATALOG_PATH)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], "Authentication credentials were not provided.")

    def test_user_can_access_his_catalogue_list(self):
        # user 1
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.CATALOG_PATH)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        catalogues_number = 0
        for catalogue in response.data:
            catalogues_number += 1
            self.assertEqual(catalogue['catalogue_name'], "test_user_1")
        self.assertEqual(10, catalogues_number)
        # user 2
        self.client.force_authenticate(user=self.user_2)
        response = self.client.get(self.CATALOG_PATH)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        catalogues_number = 0
        for catalogue in response.data:
            catalogues_number += 1
            self.assertEqual(catalogue['catalogue_name'], "test_user_2")
        self.assertEqual(5, catalogues_number)

    def test_user_can_crete_a_catalogue_success(self):
        self.client.force_authenticate(user=self.user_1)
        catalogue_name = "catalogue_name"
        data = {"catalogue_name": catalogue_name, "catalogue_scope": QuestionCatalogue.SEEVCAM_SCOPE}
        response = self.client.post(self.CATALOG_PATH, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['catalogue_name'], catalogue_name)
        self.assertEqual(response.data['catalogue_scope'], QuestionCatalogue.SEEVCAM_SCOPE)
        question_catalogue = QuestionCatalogue.objects.get(catalogue_name=catalogue_name, catalogue_owner=self.user_1)
        self.assertEqual(question_catalogue.catalogue_name, catalogue_name)

    def test_user_can_crete_a_catalogue_failure(self):
        self.client.force_authenticate(user=self.user_1)
        catalogue_name = "catalogue_name"
        #
        data = {}
        response = self.client.post(self.CATALOG_PATH, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        #
        data = {"catalogue_name": "", "catalogue_scope": QuestionCatalogue.SEEVCAM_SCOPE}
        response = self.client.post(self.CATALOG_PATH, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        #
        data = {"catalogue_name": catalogue_name, "catalogue_scope": "incorrect_scope"}
        response = self.client.post(self.CATALOG_PATH, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_can_access_a_catalogue_using_its_id(self):
        # user 1
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.CATALOG_PATH + "1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['catalogue_name'], "test_user_1")
        self.assertEqual(response.data['catalogue_scope'], QuestionCatalogue.PRIVATE_SCOPE)
        # user 2
        self.client.force_authenticate(user=self.user_2)
        response = self.client.get(self.CATALOG_PATH + "11/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['catalogue_name'], "test_user_2")
        self.assertEqual(response.data['catalogue_scope'], QuestionCatalogue.PRIVATE_SCOPE)

    def test_user_cannot_access_catalogues_belonging_to_another_user(self):
        # the following calls return 404 because the object requested doesn't belong to
        #to the user query set
        # user 1
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.CATALOG_PATH + "11/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # user 2
        self.client.force_authenticate(user=self.user_2)
        response = self.client.get(self.CATALOG_PATH + "1/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_delete_a_catalogue_using_its_id(self):
        self.client.force_authenticate(user=self.user_1)
        response = self.client.delete(self.CATALOG_PATH + "1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertRaises(QuestionCatalogue.DoesNotExist, lambda: QuestionCatalogue.objects.get(pk=1))

    def test_user_can_update_a_catalogue(self):
        self.client.force_authenticate(user=self.user_1)
        updated_name = "updated_name"
        data = {"catalogue_name": updated_name}
        response = self.client.put(self.CATALOG_PATH + "1/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        question_catalogue = QuestionCatalogue.objects.get(pk=1, catalogue_owner=self.user_1)
        self.assertEqual(question_catalogue.catalogue_name, updated_name)

    def test_user_can_access_questions_within_a_catalogue(self):
        #first catalogue
        self.client.force_authenticate(user=self.user_1)
        self._verify_response_question_list(1, 10)
        self._verify_response_question_list(2, 3)
        #second catalogue
        self.client.force_authenticate(user=self.user_2)
        self._verify_response_question_list(11, 5)
        self._verify_response_question_list(12, 6)

    def test_user_can_access_only_questions_that_are_in_its_own_catalogues(self):
        #first catalogue
        self.client.force_authenticate(user=self.user_1)
        self._verified_forbidden_access_list(11)
        self._verified_forbidden_access_list(12)
        #second catalogue
        self.client.force_authenticate(user=self.user_2)
        self._verified_forbidden_access_list(1)
        self._verified_forbidden_access_list(2)

    def test_user_can_append_a_question_to_a_catalogue(self):
        self.client.force_authenticate(user=self.user_1)
        path = self.QUESTION_PATH_LIST.format(3)
        data = {"question_text": "question"}
        response = self.client.post(path, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self._verify_response_question_list(3, 1)

    @staticmethod
    def _create_user(username):
        user = SeevUser(username=username, email='test@email.com')
        user.save()
        return user

    @staticmethod
    def _create_catalogues(user, how_many):
        for i in range(how_many):
            q = QuestionCatalogue(catalogue_name='test_' + user.username, catalogue_owner=user,
                                  catalogue_scope=QuestionCatalogue.PRIVATE_SCOPE)
            q.save()

    @staticmethod
    def _create_questions(catalogue, how_many):
        for i in range(how_many):
            q = Question(question_text="question text", question_catalogue=catalogue)
            q.save()

    def _verify_response_question_list(self,  cat, how_many):
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
