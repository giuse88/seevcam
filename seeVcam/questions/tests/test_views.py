from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from unittest import skip

from authentication.models import SeevcamUser
from questions.models import QuestionCatalogue, Question


class QuestionCatalogueViewTests(APITestCase):
    factory = None
    client = None

    def setUp(self):
        self.factory = APIRequestFactory()
        self.client = APIClient()
        self.CATALOG_PATH = '/questions/catalogue/'
        self.CATALOG_PATH_WITH_PRIVATE_SCOPE = self.CATALOG_PATH + '?scope=private'
        self.SEEVCAM_CATALOGUE_PATH = self.CATALOG_PATH + 'seevcam/'
        self.QUESTION_PATH_LIST = '/questions/catalogue/{0}/list/'
        self.QUESTION_PATH_DETAILS = '/questions/catalogue/{0}/list/{1}/'
        self.user_1 = QuestionCatalogueViewTests._create_user('user_1')
        self.user_2 = QuestionCatalogueViewTests._create_user('user_2')
        self.admin = QuestionCatalogueViewTests._create_user('admin', True)
        QuestionCatalogueViewTests._create_catalogues(self.user_1, 10)
        QuestionCatalogueViewTests._create_catalogues(self.user_2, 5)
        QuestionCatalogueViewTests._create_catalogues(self.admin, 3, QuestionCatalogue.SEEVCAM_SCOPE)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=1), 10)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=2), 3)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=11), 5)
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=12), 6)
        ##### sevcam questions
        QuestionCatalogueViewTests._create_questions(QuestionCatalogue.objects.get(pk=17), 10)

    def test_unauthenticated_user(self):
        response = self.client.get(self.CATALOG_PATH)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.data['detail'], "Authentication credentials were not provided.")

    def test_user_can_access_his_catalogue_list(self):
        # user 1
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.CATALOG_PATH)
        self._verify_get_catalogue(response, "test_user_1", 10)
        # user 2
        self.client.force_authenticate(user=self.user_2)
        response = self.client.get(self.CATALOG_PATH)
        self._verify_get_catalogue(response, "test_user_2", 5)

    @skip("This test is meant to be used when the scope feature is activated")
    def test_user_can_access_his_catalogue_list_using_private_scope(self):
        # user 1
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.CATALOG_PATH_WITH_PRIVATE_SCOPE)
        self._verify_get_catalogue(response, "test_user_1", 10)
        # user 2
        self.client.force_authenticate(user=self.user_2)
        response = self.client.get(self.CATALOG_PATH_WITH_PRIVATE_SCOPE)
        self._verify_get_catalogue(response, "test_user_2", 5)

    def test_user_can_create_a_catalogue_success(self):
        self.client.force_authenticate(user=self.user_1)
        catalogue_name = "catalogue_name"
        data = {"catalogue_name": catalogue_name, "catalogue_scope": QuestionCatalogue.SEEVCAM_SCOPE}
        response = self.client.post(self.CATALOG_PATH, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['catalogue_name'], catalogue_name)
        self.assertEqual(response.data['catalogue_scope'], QuestionCatalogue.SEEVCAM_SCOPE)
        question_catalogue = QuestionCatalogue.objects.get(catalogue_name=catalogue_name, catalogue_owner=self.user_1)
        self.assertEqual(question_catalogue.catalogue_name, catalogue_name)

    def test_user_can_create_a_catalogue_failure(self):
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
        self.assertEqual(Question.objects.filter(question_catalogue=1).count(), 0)

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

    def test_user_can_access_to_a_question_details_that_belong_to_him(self):
        self.client.force_authenticate(user=self.user_1)
        path = self.QUESTION_PATH_DETAILS.format(1, 1)
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_gets_404_when_try_to_access_a_question_that_is_not_in_his_catalogues(self):
        self.client.force_authenticate(user=self.user_1)
        path = self.QUESTION_PATH_DETAILS.format(1, 12)
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_receives_403_when_try_to_access_a_question_that_does_not_belong_to_him(self):
        self.client.force_authenticate(user=self.user_1)
        path = self.QUESTION_PATH_DETAILS.format(12, 1)
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_delete_a_question_to_a_specific_catalogue(self):
        self.client.force_authenticate(user=self.user_1)
        path = self.QUESTION_PATH_DETAILS.format(1, 1)
        response = self.client.delete(path)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self._verify_response_question_list(1, 9)
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_a_question(self):
        text = "updated_text"
        data = {"question_text": text}
        #
        self.client.force_authenticate(user=self.user_1)
        path = self.QUESTION_PATH_DETAILS.format(1, 1)
        response = self.client.put(path, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        #
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['question_text'], text)

    def test_get_seevcam_catalogues(self):
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.SEEVCAM_CATALOGUE_PATH)
        self._verify_get_catalogue(response, "test_admin", 3)

    def test_user_cannot_create_catalogues_in_the_seevcam_scope(self):
        self.client.force_authenticate(user=self.user_1)
        data = {"catalogue_name": "test", "catalogue_scope": QuestionCatalogue.SEEVCAM_SCOPE}
        response = self.client.post(self.SEEVCAM_CATALOGUE_PATH, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_questions_within_a_seevcam_catalogue(self):
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.SEEVCAM_CATALOGUE_PATH + '17/list/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_a_user_cannot_delete_a_question_in_the_seevcam_catalgoue(self):
        self.client.force_authenticate(user=self.user_1)
        #
        response = self.client.delete(self.SEEVCAM_CATALOGUE_PATH + '17/list/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        # The delete view is not exposed
        response = self.client.delete(self.SEEVCAM_CATALOGUE_PATH + '17/list/30/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


    #############################################################
    #                          PRIVATE                          #
    #############################################################

    @staticmethod
    def _create_user(username, admin=False):
        user = SeevcamUser(username=username, email='test@email.com')
        user.is_staff = admin
        user.save()
        return user

    @staticmethod
    def _create_catalogues(user, how_many, scope=QuestionCatalogue.PRIVATE_SCOPE):
        for i in range(how_many):
            q = QuestionCatalogue(catalogue_name='test_' + user.username, catalogue_owner=user,
                                  catalogue_scope=scope)
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

    def _verify_get_catalogue(self, response, user_str, how_many):
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        catalogues_number = 0
        for catalogue in response.data:
            catalogues_number += 1
            self.assertEqual(catalogue['catalogue_name'], user_str)
        self.assertEqual(how_many, catalogues_number)
