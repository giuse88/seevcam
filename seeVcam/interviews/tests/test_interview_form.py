from StringIO import StringIO
import os
import datetime

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
        self.old_media_root = settings.MEDIA_ROOT
        settings.MEDIA_ROOT = settings.MEDIA_ROOT.replace('media', '')
        settings.MEDIA_ROOT = os.path.join(settings.MEDIA_ROOT, 'interviews', 'tests', 'test-file')
        self.valid_interview_date = (datetime.datetime.now() + datetime.timedelta(days=1)).date()
        self.invalid_interview_time = (datetime.datetime.now() - datetime.timedelta(hours=1)).time()
        self.valid_interview_time = "10:00"
        self.user_1 = self._create_dummy_user('user_1', 'test')
        self.user_2 = self._create_dummy_user('user_2', 'test')
        self.file_cv = self._create_upload_file()
        self.file_job = self._create_upload_file()
        self.catalogue = self._create_dummy_catalogue("test", self.user_1)

    def tearDown(self):
        settings.MEDIA_ROOT = self.old_media_root

    def test_user_can_create_an_interview(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id,
                                          self.valid_interview_date,
                                          self.valid_interview_time)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview = Interview.objects.get(pk=1)
        self.assertEqual(interview.candidate_name, "name")
        self._remove_uploaded_files(interview)

    def test_two_users_can_create_an_interview(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, self.valid_interview_date,
                                          self.valid_interview_time)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self.client.logout()
        #
        self.client.login(username='user_2', password='test')
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, self.valid_interview_date, self.valid_interview_time)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_2).count(), 1)
        self.assertEqual(Interview.objects.count(), 2)
        interview_2 = Interview.objects.get(pk=2)
        self.assertEqual(interview_2.candidate_name, "name")
        #
        self._remove_uploaded_files(interview_1)
        self._remove_uploaded_files(interview_2)

    def test_data_validation(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2003-12-12",
                                          self.valid_interview_time)
        self.assertTrue('Please check interview date' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _test_time_validation(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, self.valid_interview_date,
                                          self.invalid_interview_time)
        print self.invalid_interview_time
        self.assertTrue('Please check interview time' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

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

    def _create_interview(self, file_cv, file_job_dec, catalogue_id, date, time):
        data = {
            'candidate_email': "test@email.it",
            'candidate_name': "name",
            'candidate_surname': "surname",
            'candidate_cv': file_cv,
            'interview_job_description': file_job_dec,
            'interview_catalogue': catalogue_id,
            'interview_description': "test",
            'interview_date': date,
            'interview_time': time
        }
        response = self.client.post(self.INTERVIEW_CREATE, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        return response

    def _remove_uploaded_files(self, interview):
        os.remove(interview.candidate_cv.path)
        os.remove(interview.interview_job_description.path)
        os.rmdir(os.path.join(settings.MEDIA_ROOT, str(interview.interview_owner_id), str(interview.id), 'cv'))
        os.rmdir(os.path.join(settings.MEDIA_ROOT, str(interview.interview_owner_id), str(interview.id), 'job'))
        os.rmdir(os.path.join(settings.MEDIA_ROOT, str(interview.id), str(interview.interview_owner_id)))
        os.rmdir(os.path.join(settings.MEDIA_ROOT, str(interview.id)))
