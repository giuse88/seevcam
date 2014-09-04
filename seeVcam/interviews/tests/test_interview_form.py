from StringIO import StringIO
import os
from django.core.files.uploadedfile import SimpleUploadedFile

from django.test import TestCase
from django.conf import settings
from rest_framework import status

from authentication.models import SeevcamUser
from interviews.models import Interview
from questions.models import QuestionCatalogue


class InterviewFormTest(TestCase):
    client = None
    INTERVIEW_CREATE = "/dashboard/interviews/create/"

    def setUp(self):
        self.user_1 = self._create_dummy_user('user_1', 'test')
        self.user_2 = self._create_dummy_user('user_2', 'test')
        self.file_cv = self._create_upload_file()
        self.file_job = self._create_upload_file()
        self.catalogue = self._create_dummy_catalogue("test", self.user_1)

    def test_user_can_create_an_interview(self):
        self._log_in_dummy_user('user_1','test')
        data = {
            'candidate_email': "test@email.it",
            'candidate_name': "name",
            'candidate_surname': "surname",
            'candidate_cv': self.file_cv,
            'interview_job_description': self.file_job,
            'interview_catalogue': self.catalogue.id,
            'interview_description': "test",
            'interview_date': '2014-12-23',
            'interview_time': "11:30"
        }
        response = self.client.post(self.INTERVIEW_CREATE, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.count(), 1)
        self.assertEqual(Interview.objects.get(pk=1).candidate_name, "name")
        #cleaning up
        interview = Interview.objects.get(pk=1)
        os.remove(interview.candidate_cv.path)
        os.remove(interview.interview_job_description.path)

    def test_data_validation(self):
        pass

    def test_time_validation(self):
        pass

    #Private
    def _create_upload_file(self):
        raw_content = StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00'
                     '\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        return SimpleUploadedFile("test.txt", raw_content.read())

    def _log_in_dummy_user(self, username, password):
        self.client.post(settings.LOGIN_URL, {'username': username, 'password': password})

    def _create_dummy_user(self, username, password):
        user = SeevcamUser.objects.create_user(username, password=password)
        user.save()
        return user

    def _create_dummy_catalogue(self, name, user):
        catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                      catalogue_name=name, catalogue_owner=user)
        catalogue.save()
        return catalogue
