from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from unittest import skip

class TestNotesRESTAPI(APITestCase):
    factory = APIRequestFactory()
    client = APIClient()
    CATALOG_PATH = '/dashboard/interview/{0}/notes'

    def test_user_can_retrieve_notes_attached_to_one_of_his_interviews(self):
        pass

    def test_user_can_update_notes_attached_to_one_of_his_interviews(self):
        pass
