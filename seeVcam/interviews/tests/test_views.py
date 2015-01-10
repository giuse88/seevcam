from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from authentication.models import SeevcamUser
from common.helpers.test_helper import create_user, create_uploaded_file, create_interview, create_candidate, \
    create_job_position, create_question, create_catalogue, create_company
from company_profile.models import Company
from interviews.models import Candidate, JobPosition, Interview


class InterviewViewTest(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))
        self.interview = create_interview(self.user, self.catalogue, self.candidate, self.job_position)

    def tearDown(self):
        JobPosition.objects.all().delete()
        Candidate.objects.all().delete()
        Company.objects.all().delete()
        SeevcamUser.objects.all().delete()
        Interview.objects.all().delete()
        self.candidate.delete()
        self.company.delete()
        self.user.delete()
        self.job_position.delete()
        self.interview.delete()
        del self.company
        del self.user
        del self.candidate
        del self.job_position
        del self.interview

    # ###############################################################################
    #                                   PUBLIC TESTS                                #
    # ###############################################################################

    def test_get_interview_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/dashboard/interviews/interviews/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(isinstance(response.data, list))
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.interview.id)
        self.assertEqual(response.data[0]['start'], "2015-05-04T12:20:34.000343+0000")
        self.assertEqual(response.data[0]['end'], "2015-05-04T13:20:34.000343+0000")

    def test_get_interview_details(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/dashboard/interviews/interviews/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.interview.id)
        self.assertEqual(response.data['start'], "2015-05-04T12:20:34.000343+0000")
        self.assertEqual(response.data['end'], "2015-05-04T13:20:34.000343+0000")

    def test_user_can_create_an_interview(self):
        cv = create_uploaded_file(self.user)
        self.client.force_authenticate(user=self.user)
        interview_json = {"start": "2015-05-04T12:20:34.0+0000",
                          "end": "2015-05-04T13:20:34.0+0000",
                          "status": "OPEN",
                          "job_position": 1,
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": cv.id},
                          "catalogue": 1}
        response = self.client.post("/dashboard/interviews/interviews/", interview_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_cannot_create_an_interview_with_incorrect_times(self):
        cv = create_uploaded_file(self.user)
        self.client.force_authenticate(user=self.user)
        interview_json = {"start": "2014-12-23T11:30:00Z",
                          "end": "2014-12-23T12:00:00Z",
                          "status": "OPEN",
                          "job_position": 1,
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": cv.id},
                          "catalogue": 1}
        response = self.client.post("/dashboard/interviews/interviews/", interview_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(response.data['start'][0])
        self.assertEqual(response.data['start'][0],
                         'Datetime has wrong format. Use one of these formats instead: YYYY-MM-DDThh:mm:ss.uuuuuu[+HHMM|-HHMM]')
        self.assertIsNotNone(response.data['end'][0])
        self.assertEqual(response.data['end'][0],
                         'Datetime has wrong format. Use one of these formats instead: YYYY-MM-DDThh:mm:ss.uuuuuu[+HHMM|-HHMM]')

    def test_user_can_update_a_interview_date(self):
        self.client.force_authenticate(user=self.user)
        interview_json = {"id": 1,
                          "start": "2015-06-04T12:20:34.0+0000",
                          "end": "2015-06-04T13:20:34.0+0000",
                          "status": "OPEN",
                          "job_position": 1,
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": 2},
                          "catalogue": 1}
        response = self.client.put("/dashboard/interviews/interviews/1/", interview_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['start'], "2015-06-04T12:20:34.000000+0000")
        self.assertEqual(response.data['end'], "2015-06-04T13:20:34.000000+0000")

    def test_user_can_update_candidate_info(self):
        self.client.force_authenticate(user=self.user)
        interview = {"id": 1,
                     "start": "2015-06-04T12:20:34.0+0000",
                     "end": "2015-06-04T13:20:34.0+0000",
                     "status": "OPEN",
                     "job_position": 1,
                     "candidate": {"name": "update", "email": "test_1@test.com", "surname": "pes", "cv": 2},
                     "catalogue": 1}
        response = self.client.put("/dashboard/interviews/interviews/1/", interview, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_candidate = Candidate.objects.get(pk=1)
        self.assertEqual(updated_candidate.name, "update")

    def test_user_can_delete_interview(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/dashboard/interviews/interviews/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Interview.objects.count(), 0)

    def test_user_cannot_create_a_interview_in_the_past_start(self):
        self.client.force_authenticate(user=self.user)
        interview_json = {"id": 1,
                          "start": "2013-06-04T12:20:34.0+0000",
                          "end": "2015-06-04T13:20:34.0+0000",
                          "status": "OPEN",
                          "job_position": 1,
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": 2},
                          "catalogue": 1}
        response = self.client.put("/dashboard/interviews/interviews/1/", interview_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['start'][0], "Invalid start date. Start date expired.")

    def test_user_cannot_create_a_interview_in_the_past_end(self):
        self.client.force_authenticate(user=self.user)
        interview_json = {"id": 1,
                          "start": "2015-06-04T12:20:34.0+0000",
                          "end": "2013-06-04T13:20:34.0+0000",
                          "status": "OPEN",
                          "job_position": 1,
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": 2},
                          "catalogue": 1}
        response = self.client.put("/dashboard/interviews/interviews/1/", interview_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['end'][0], "Invalid end date. End date expired.")

    def test_user_cannot_create_a_interview_with_an_invalid_timezone(self):
        self.client.force_authenticate(user=self.user)
        interview_json = {"id": 1,
                          "start": "2015-06-04T12:20:34.0+0100",
                          "end": "2015-06-04T13:20:34.0+0100",
                          "status": "OPEN",
                          "job_position": 1,
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": 2},
                          "catalogue": 1}
        response = self.client.put("/dashboard/interviews/interviews/1/", interview_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['start'][0], "Invalid timezone.")
        self.assertEqual(response.data['end'][0], "Invalid timezone.")

    def test_user_cannot_create_a_interview_without_datetime(self):
        self.client.force_authenticate(user=self.user)
        interview_json = {"status": "OPEN",
                          "job_position": 1,
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": 2},
                          "catalogue": 1}
        response = self.client.post("/dashboard/interviews/interviews/", interview_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['start'][0], "This field is required.")
        self.assertEqual(response.data['end'][0], "This field is required.")

    def test_user_cannot_create_an_interview_with_end_before_start(self):
        cv = create_uploaded_file(self.user)
        self.client.force_authenticate(user=self.user)
        interview_json = {"start": "2015-06-04T16:20:34.0+0000",
                          "end": "2015-06-04T13:20:34.0+0000",
                          "status": "OPEN",
                          "job_position": 1,
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": cv.id},
                          "catalogue": 1}
        response = self.client.post("/dashboard/interviews/interviews/", interview_json, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIsNotNone(response.data['non_field_errors'])
        self.assertEqual(response.data['non_field_errors'][0], 'End must be before than start.')

    # def _test_a_users_cannot_schedule_two_interview_at_the_same_time(self):
    #     #
    #     self.client.login(username='user_1', password='test')
    #     response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00")
    #     self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    #     self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
    #     self.assertEqual(Interview.objects.count(), 1)
    #     interview_1 = Interview.objects.get(pk=1)
    #     self.assertEqual(interview_1.candidate_name, "name")
    #     self._remove_uploaded_files(interview_1)
    #     #
    #     response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00")
    #     print response
    #     self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #
    # def _test_overlapping_interviews_1(self):
    #     #
    #     self.client.login(username='user_1', password='test')
    #     response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00", 30)
    #     self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    #     self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
    #     self.assertEqual(Interview.objects.count(), 1)
    #     interview_1 = Interview.objects.get(pk=1)
    #     self.assertEqual(interview_1.candidate_name, "name")
    #     self._remove_uploaded_files(interview_1)
    #     #
    #     response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
    #                                       self.catalogue.id, "2030-1-1 11:05", 15)
    #     print response
    #     # self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #
    # def _test_overlapping_interviews_2(self):
    #     #
    #     self.client.login(username='user_1', password='test')
    #     response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:05", 15)
    #     self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    #     self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
    #     self.assertEqual(Interview.objects.count(), 1)
    #     interview_1 = Interview.objects.get(pk=1)
    #     self.assertEqual(interview_1.candidate_name, "name")
    #     self._remove_uploaded_files(interview_1)
    #     #
    #     response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
    #                                       self.catalogue.id, "2030-1-1 11:00", 30)
    #     print response
    #     # self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #
    # def _test_overlapping_interviews_3(self):
    #     #
    #     self.client.login(username='user_1', password='test')
    #     response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00", 30)
    #     self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    #     self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
    #     self.assertEqual(Interview.objects.count(), 1)
    #     interview_1 = Interview.objects.get(pk=1)
    #     self.assertEqual(interview_1.candidate_name, "name")
    #     self._remove_uploaded_files(interview_1)
    #     #
    #     response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
    #                                       self.catalogue.id, "2030-1-1 10:45", 30)
    #     print response
    #     self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #
    # def _test_overlapping_interviews_4(self):
    #     #
    #     self.client.login(username='user_1', password='test')
    #     response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00", 30)
    #     self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    #     self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
    #     self.assertEqual(Interview.objects.count(), 1)
    #     interview_1 = Interview.objects.get(pk=1)
    #     self.assertEqual(interview_1.candidate_name, "name")
    #     self._remove_uploaded_files(interview_1)
    #     #
    #     response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
    #                                       self.catalogue.id, "2030-1-1 11:15", 30)
    #     print response
    #     self.assertTrue('Another interview has already been scheduled for the date selected' in response.content)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #
    # def _test_overlapping_interviews_correct(self):
    #     #
    #     self.client.login(username='user_1', password='test')
    #     response = self._create_interview(self.file_cv, self.file_job, self.catalogue.id, "2030-1-1 11:00", 30)
    #     self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    #     self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 1)
    #     self.assertEqual(Interview.objects.count(), 1)
    #     interview_1 = Interview.objects.get(pk=1)
    #     self.assertEqual(interview_1.candidate_name, "name")
    #     self._remove_uploaded_files(interview_1)
    #     #
    #     response = self._create_interview(self._create_upload_file(), self._create_upload_file(),
    #                                       self.catalogue.id, "2030-1-1 11:30", 30)
    #     self.assertEqual(response.status_code, status.HTTP_302_FOUND)
    #     self.assertEqual(Interview.objects.filter(interview_owner=self.user_1).count(), 2)
    #     self.assertEqual(Interview.objects.count(), 2)
    #     interview_1 = Interview.objects.get(pk=2)
    #     self.assertEqual(interview_1.candidate_name, "name")
    #     self._remove_uploaded_files(interview_1)