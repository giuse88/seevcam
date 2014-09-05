from StringIO import StringIO
import os

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from rest_framework import status
from django.conf import settings

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
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview = Interview.objects.get(pk=1)
        self.assertEqual(interview.candidate_name, "name")
        self._remove_uploaded_files(interview)

    def test_two_users_can_create_an_interview(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self.client.logout()
        #
        self.client.login(username='user_2', password='test')
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_2).count(), 1)
        self.assertEqual(Interview.objects.count(), 2)
        interview_2 = Interview.objects.get(pk=2)
        self.assertEqual(interview_2.candidate_name, "name")
        #
        self._remove_uploaded_files(interview_1)
        self._remove_uploaded_files(interview_2)

    def test_data_validation(self):
        #TODO when implement timezone
        pass

    def test_time_validation(self):
        #TODO when implement timezone
        pass

    # Private
    def _create_upload_file(self):
        raw_content = StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00'
                               '\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        return SimpleUploadedFile("test.txt", raw_content.read())

    def _create_dummy_user(self, username, password):
        user = SeevcamUser.objects.create_user(username, password=password)
        user.save()
        return user

    def _create_dummy_catalogue(self, name, user):
        catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                      catalogue_name=name, catalogue_owner=user)
        catalogue.save()
        return catalogue

    def _create_interview(self, file_cv, file_job_dec, catalogue_id):
        data = {
            'candidate_email': "test@email.it",
            'candidate_name': "name",
            'candidate_surname': "surname",
            'candidate_cv': file_cv,
            'interview_job_description': file_job_dec,
            'interview_catalogue': catalogue_id,
            'interview_description': "test",
            'interview_date': '2014-12-23',
            'interview_time': "11:30"
        }
        response = self.client.post(self.INTERVIEW_CREATE, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        return response

    def _remove_uploaded_files(self, interview):
        os.remove(interview.candidate_cv.path)
        os.remove(interview.interview_job_description.path)
        os.rmdir(os.path.join(settings.MEDIA_ROOT, str(interview.interview_owner_id), 'cv'))
        os.rmdir(os.path.join(settings.MEDIA_ROOT, str(interview.interview_owner_id), 'job'))
        os.rmdir(os.path.join(settings.MEDIA_ROOT, str(interview.interview_owner_id)))
