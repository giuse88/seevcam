from StringIO import StringIO
import os
import datetime

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from pytz import timezone
from rest_framework import status
from django.conf import settings

from authentication.models import SeevcamUser
from common.helpers.timezone import to_user_timezone
from interviews.models import Interview
from questions.models import QuestionCatalogue


class InterviewFormTest(TestCase):
    client = None
    INTERVIEW_CREATE = "/dashboard/interviews/create/"

    def setUp(self):
        self.old_media_root = settings.MEDIA_ROOT
        settings.MEDIA_ROOT = settings.MEDIA_ROOT.replace('media', '')
        settings.MEDIA_ROOT = os.path.join(settings.MEDIA_ROOT, 'interviews', 'tests', 'test-file')
        self.valid_interview_datetime = (
            datetime.datetime.now(tz=timezone('Europe/London')) + datetime.timedelta(days=1))
        self.valid_interview_datetime = self.valid_interview_datetime.strftime("%Y-%m-%d %H:%M")
        self.invalid_interview_datetime = (
            datetime.datetime.now(tz=timezone('Europe/London')) - datetime.timedelta(hours=1))
        self.invalid_interview_datetime = self.invalid_interview_datetime.strftime("%Y-%m-%d %H:%M")

        print self.valid_interview_datetime
        print self.invalid_interview_datetime

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
                                          self.valid_interview_datetime)
        print response
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview = Interview.objects.get(pk=1)
        self.assertEqual(interview.candidate_name, "name")
        self._remove_uploaded_files(interview)


    def test_user_can_create_an_interview_with_timezone(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id,
                                          self.valid_interview_datetime)
        print response
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview = Interview.objects.get(pk=1)
        self.assertEqual(interview.candidate_name, "name")
        retrieved_datetime = to_user_timezone(interview.interview_datetime, self.user_1).strftime("%Y-%m-%d %H:%M")
        self.assertEqual(retrieved_datetime, self.valid_interview_datetime)
        self._remove_uploaded_files(interview)


    def test_two_users_can_create_an_interview(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id,
                                          self.valid_interview_datetime)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self.client.logout()
        #
        self.client.login(username='user_2', password='test')
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, self.valid_interview_datetime)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_2).count(), 1)
        self.assertEqual(Interview.objects.count(), 2)
        interview_2 = Interview.objects.get(pk=2)
        self.assertEqual(interview_2.candidate_name, "name")
        #
        self._remove_uploaded_files(interview_1)
        self._remove_uploaded_files(interview_2)

    def test_a_users_cannot_schedule_two_interview_at_the_same_time(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00")
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self._remove_uploaded_files(interview_1)
        #
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00")
        print response
        self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_overlapping_interviews_1(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00", 30)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self._remove_uploaded_files(interview_1)
        #
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, "2030-1-1 11:05", 15)
        print response
        # self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_overlapping_interviews_2(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:05", 15)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self._remove_uploaded_files(interview_1)
        #
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, "2030-1-1 11:00", 30)
        print response
        # self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_overlapping_interviews_3(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00", 30)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self._remove_uploaded_files(interview_1)
        #
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, "2030-1-1 10:45", 30)
        print response
        # self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_overlapping_interviews_4(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00", 30)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self._remove_uploaded_files(interview_1)
        #
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, "2030-1-1 11:15", 30)
        print response
        # self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_data_validation(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2003-12-12 00:00")
        self.assertTrue('You cannot create a interview in the past!' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_time_validation(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, self.invalid_interview_datetime)
        print response
        self.assertTrue('You cannot create a interview in the past!' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_file_validation_size(self):
        self.old_file_size = settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = 1

        self.client.login(username='user_1', password='test')
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, self.valid_interview_datetime)
        self.assertTrue('Please keep filesize under' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = self.old_file_size

    def test_file_validation_size_cv(self):
        self.old_file_size = settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = 1

        self.client.login(username='user_1', password='test')

        cv = self._create_upload_file('test.bmp', 'image/bmp')
        response = self._create_interview(cv, self._create_upload_file(),
                                          self.catalogue.id, self.valid_interview_datetime)
        self.assertTrue('Please use a file with a different format' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = self.old_file_size

    def test_file_validation_size_job_spec(self):
        self.old_file_size = settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = 1
        self.client.login(username='user_1', password='test')

        cv = self._create_upload_file('test.bmp', 'image/bmp')
        response = self._create_interview(self._create_upload_file(), cv,
                                          self.catalogue.id, self.valid_interview_datetime)
        self.assertTrue('Please use a file with a different format' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = self.old_file_size

    # Private
    def _create_upload_file(self, name="test.pdf", type='application/pdf'):
        raw_content = StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00'
                               '\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        return SimpleUploadedFile(name, raw_content.read(), type)

    def _create_dummy_user(self, username, password):
        user = SeevcamUser.objects.create_user(username, password=password)
        user.timezone = 'Europe/London'
        user.save()
        return user

    def _create_dummy_catalogue(self, name, user):
        catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                      catalogue_name=name, catalogue_owner=user)
        catalogue.save()
        return catalogue

    def _create_interview(self, file_cv, file_job_dec, catalogue_id, user_datetime, duration=15):
        data = {
            'candidate_email': "test@email.it",
            'candidate_name': "name",
            'candidate_surname': "surname",
            'candidate_cv': file_cv,
            'interview_job_description': file_job_dec,
            'interview_position': 'job',
            'interview_catalogue': catalogue_id,
            'interview_description': "test",
            'interview_duration': duration,
            'interview_datetime': user_datetime,
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


    def _create_interview_data_object(self, file_cv, file_job_dec, catalogue_id, user_datetime):
        data = {
            'candidate_email': "test@email.it",
            'candidate_name': "name",
            'candidate_surname': "surname",
            'candidate_cv': file_cv,
            'interview_job_description': file_job_dec,
            'interview_position': 'job',
            'interview_catalogue': catalogue_id,
            'interview_description': "test",
            'interview_duration': 15,
            'interview_datetime': user_datetime
        }
        return data

