from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory, APIClient
from notes.models import Notes


class TestNotesRESTAPI(APITestCase):
    factory = APIRequestFactory()
    client = APIClient()
    NOTE_URL = '/dashboard/interviews/{0}/notes/'

    def setUp(self):
        self.interview = create_interview_model()
        self.user_1 = create_dummy_user('test', 'test')

    def test_user_can_retrieve_notes_attached_to_one_of_his_interviews(self):
        notes = Notes.objects.get(interview=self.interview)
        notes.text_content = "test"
        notes.save()
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.NOTE_URL.format(self.interview.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text_content'], "test")

    def test_user_can_update_notes_attached_to_one_of_his_interviews(self):
        notes = Notes.objects.get(interview=self.interview)
        notes.text_content = "test"
        notes.save()
        self.client.force_authenticate(user=self.user_1)
        response = self.client.get(self.NOTE_URL.format(self.interview.id))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text_content'], "test")
        update = {"text_content": "update"}
        response = self.client.put(self.NOTE_URL.format(self.interview.id), update, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['text_content'], "update")
