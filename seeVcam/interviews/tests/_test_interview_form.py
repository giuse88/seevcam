from StringIO import StringIO
import os
import datetime

from django.test import TestCase
from pytz import timezone
from rest_framework import status
from django.conf import settings
from common.helpers.test_helper import create_dummy_user, create_dummy_company, create_upload_file

from common.helpers.timezone import to_user_timezone
from file_upload.models import UploadedFile
from interviews.models import Interview
from questions.models import QuestionCatalogue


class InterviewFormTest(TestCase):
    client = None
    INTERVIEW_CREATE = "/dashboard/interviews/create/"

    def setUp(self):
        self.old_media_root = settings.MEDIA_ROOT
        settings.MEDIA_ROOT = settings.MEDIA_ROOT.replace('media', '')
        settings.MEDIA_ROOT = os.path.join(settings.MEDIA_ROOT, 'interviews', 'tests', 'test-file')

        self.start = (datetime.datetime.now(tz=timezone('Europe/London')) + datetime.timedelta(days=1))
        self.end = self.start + datetime.timedelta(hours=1)

        self.start = self.start.strftime("%Y-%m-%d %H:%M")
        self.end = self.end.strftime("%Y-%m-%d %H:%M")

        self.invalid_interview_datetime = (
            datetime.datetime.now(tz=timezone('Europe/London')) - datetime.timedelta(hours=1))
        self.invalid_interview_datetime = self.invalid_interview_datetime.strftime("%Y-%m-%d %H:%M")

        self.company = create_dummy_company()
        self.user_1 = create_dummy_user('user_1', self.company, 'test')
        self.user_2 = create_dummy_user('user_2', self.company, 'test')

        self.file_cv = create_upload_file()
        self.uploaded_cv = UploadedFile.objects.create_uploaded_file(self.file_cv, self.user_1, "curriculum")
        self.file_job = create_upload_file()
        self.uploaded_job = UploadedFile.objects.create_uploaded_file(self.file_job, self.user_1, "job_spec")

        self.catalogue = self._create_dummy_catalogue("test", self.user_1)

    def tearDown(self):
        settings.MEDIA_ROOT = self.old_media_root

    def test_user_can_create_an_interview(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview("test@email.com", "name", "surname", "job_position", self.uploaded_cv,
                                          self.uploaded_job, self.catalogue.id, self.start, self.end)

        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview = Interview.objects.get(pk=1)

        self.assertEqual(interview.candidate.name, "name")
        self.assertEqual(interview.candidate.surname, "surname")
        self.assertEqual(interview.candidate.cv.original_name, "test.pdf")
        self.assertEqual(interview.candidate.cv.name, "curriculum_1.pdf")

        self.assertEqual(interview.job_position.position, "job_position")
        self.assertEqual(interview.job_position.job_description.original_name, "test.pdf")
        self.assertEqual(interview.job_position.job_description.name, "job_spec_2.pdf")
        self.assertEqual(interview.catalogue.catalogue_name, "test")
        self._remove_uploaded_files(interview)


    def _test_user_can_create_an_interview_with_timezone(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id,
                                          self.start)
        print response
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview = Interview.objects.get(pk=1)
        self.assertEqual(interview.candidate_name, "name")
        retrieved_datetime = to_user_timezone(interview.interview_datetime, self.user_1).strftime("%Y-%m-%d %H:%M")
        self.assertEqual(retrieved_datetime, self.start)
        self._remove_uploaded_files(interview)


    def _test_two_users_can_create_an_interview(self):
        #
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id,
                                          self.start)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
        self.assertEqual(Interview.objects.count(), 1)
        interview_1 = Interview.objects.get(pk=1)
        self.assertEqual(interview_1.candidate_name, "name")
        self.client.logout()
        #
        self.client.login(username='user_2', password='test')
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, self.start)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_2).count(), 1)
        self.assertEqual(Interview.objects.count(), 2)
        interview_2 = Interview.objects.get(pk=2)
        self.assertEqual(interview_2.candidate_name, "name")
        #
        self._remove_uploaded_files(interview_1)
        self._remove_uploaded_files(interview_2)

    def _test_a_users_cannot_schedule_two_interview_at_the_same_time(self):
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

    def _test_overlapping_interviews_1(self):
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

    def _test_overlapping_interviews_2(self):
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

    def _test_overlapping_interviews_3(self):
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
        self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _test_overlapping_interviews_4(self):
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
        self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _test_overlapping_interviews_correct(self):
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
                                          self.catalogue.id, "2030-1-1 11:31", 30)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 2)
        self.assertEqual(Interview.objects.count(), 2)
        interview_1 = Interview.objects.get(pk=2)
        self.assertEqual(interview_1.candidate_name, "name")
        self._remove_uploaded_files(interview_1)

    def _test_data_validation(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2003-12-12 00:00")
        self.assertTrue('You cannot create a interview in the past!' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _test_time_validation(self):
        self.client.login(username='user_1', password='test')
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, self.invalid_interview_datetime)
        print response
        self.assertTrue('You cannot create a interview in the past!' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _test_file_validation_size(self):
        self.old_file_size = settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = 1

        self.client.login(username='user_1', password='test')
        response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
                                          self.catalogue.id, self.start)
        self.assertTrue('Please keep filesize under' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = self.old_file_size

    def _test_file_validation_size_cv(self):
        self.old_file_size = settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = 1

        self.client.login(username='user_1', password='test')

        cv = self._create_upload_file('test.bmp', 'image/bmp')
        response = self._create_interview(cv, self._create_upload_file(),
                                          self.catalogue.id, self.start)
        self.assertTrue('Please use a file with a different format' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = self.old_file_size

    def _test_file_validation_size_job_spec(self):
        self.old_file_size = settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = 1
        self.client.login(username='user_1', password='test')

        cv = self._create_upload_file('test.bmp', 'image/bmp')
        response = self._create_interview(self._create_upload_file(), cv,
                                          self.catalogue.id, self.start)
        self.assertTrue('Please use a file with a different format' in response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        settings.SEEVCAM_UPLOAD_FILE_MAX_SIZE = self.old_file_size



    def _create_dummy_catalogue(self, name, user):
        catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                      catalogue_name=name, catalogue_owner=user)
        catalogue.save()
        return catalogue

    def _create_interview(self, email, name, surname, position, file_cv, file_job_dec, catalogue_id, start, end):
        data = {
            'candidate-email': email,
            'candidate-name': name,
            'candidate-surname': surname,
            'candidate-cv': file_cv.id,
            'job-position-position': position,
            'job-position-job_description': file_job_dec.id,
            'interview-catalogue': catalogue_id,
            'interview-start': start,
            'interview-end': end,
        }
        response = self.client.post(self.INTERVIEW_CREATE, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        return response

    def _remove_uploaded_files(self, interview):
        os.remove(interview.candidate.cv.file.path)
        os.remove(interview.job_position.job_description.file.path)



    def _create_interview_data_object(self, file_cv, file_job_dec, catalogue_id, user_datetime):
        data = {
            'candidate_email': "test@email.it",
            'candidate_name': "name",
            'candidate_surname': "surname",
            'candidate_cv': file_cv.id,
            'interview_job_description': file_job_dec,
            'interview_position': 'job',
            'interview_catalogue': catalogue_id,
            'interview_description': "test",
            'interview_duration': 15,
            'interview_datetime': user_datetime
        }
        return data

