from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from authentication.models import SeevcamUser
from common.helpers.test_helper import create_dummy_user, create_upload_file
from company_profile.models import Company
from file_upload.models import UploadedFile
from interviews.models import Candidate, JobPosition, Interview
from questions.models import QuestionCatalogue


class InterviewViewTest(TestCase):
    # #############################################################################
    # PROPERTIES                                  #
    # #############################################################################

    # The json must be in strict mode
    question_catalogue = None

    # #############################################################################
    #                                SETTING UP                                  #
    ##############################################################################

    def setUp(self):
        self.client = APIClient()

        self.company = Company(name="test")
        self.company.save()

        self.user = create_dummy_user('test@test.com', company=self.company, password='test')

        self.file = create_upload_file()
        self.uploaded_file = UploadedFile.objects.create_uploaded_file(self.file, self.user)
        self.uploaded_file.save()

        self.candidate = Candidate(pk=1, created_by=self.user, company=self.company,
                                   name='giuseppe', surname='pes', email='test@test.com', cv=self.uploaded_file)
        self.candidate.save()

        self.catalogue = QuestionCatalogue(catalogue_name='test', catalogue_owner=self.user)
        self.catalogue.save()

        self.job_position = JobPosition(pk=1, position='text', company=self.company, created_by=self.user,
                                        job_description=None)
        self.job_position.save()

        self.interview = Interview(pk=1, status=Interview.OPEN, start='2014-12-23 11:30', end='2014-12-23 12:00',
                                   duration=30, catalogue=self.catalogue, owner=self.user, candidate=self.candidate,
                                   job_position=self.job_position)
        self.interview.save()

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

    ##############################################################################
    #                                PUBLIC TESTS                                #
    ##############################################################################

    def test_get_interview_list(self):
        expected_response = '[{"id": 1, "start": "2014-12-23T11:30:00Z", "end": "2014-12-23T12:00:00Z", "status": "OPEN", "job_position": {"id": 1, "position": "text"}, "candidate": {"id": 1, "name": "giuseppe", "email": "test@test.com", "surname": "pes"}, "catalogue": 1}]';
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/dashboard/interviews/interviews/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(str(response.content), expected_response)

    def test_get_interview_details(self):
        expected_response = '{"id": 1, "start": "2014-12-23T11:30:00Z", "end": "2014-12-23T12:00:00Z", "status": "OPEN", "job_position": {"id": 1, "position": "text"}, "candidate": {"id": 1, "name": "giuseppe", "email": "test@test.com", "surname": "pes"}, "catalogue": 1}';
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/dashboard/interviews/interviews/1/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertJSONEqual(str(response.content), expected_response)

    def test_user_can_create_an_interview(self):

        self.client.force_authenticate(user=self.user)

        uploaded_file = UploadedFile.objects.create_uploaded_file(self.file, self.user)
        uploaded_file.save()

        # cv_json = '{"id": 2, "type": "", "size": 35, "url": "/media/uploaded_files/1/_2.pdf", "delete_type": "DELETE", "delete_url": "/dashboard/files/2", "name": "_2.pdf", "original_name": "test.pdf"}'

        # expected_response = '{"id": 2, "start": "2014-12-23T11:30:00Z", "end": "2014-12-23T12:00:00Z", "status": "OPEN", "job_position": {"id": 2, "position": "text"}, "candidate": {"id": 2, "name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv":'+cv_json+'}, "catalogue": 1}'
        cv = {"id": 2, "type": "", "size": 35, "url": "/media/uploaded_files/2/_2.pdf", "delete_type": "DELETE", "delete_url": "/dashboard/files/2", "name": "_2.pdf", "original_name": "test.pdf"}
        interview_json = {"start": "2014-12-23T11:30:00Z", "end": "2014-12-23T12:00:00Z", "status": "OPEN",
                          "job_position": {"position": "text"},
                          "candidate": {"name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": 2},
                          "catalogue": 1}
        response = self.client.post("/dashboard/interviews/interviews/", interview_json, format='json')
        print response
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertJSONEqual(str(response.content), expected_response)

    def test_user_can_update_a_interview_date(self):
        pass

    def test_user_can_update_candidate_info(self):
        self.client.force_authenticate(user=self.user)
        interview = {"id": 2, "start": "2014-12-23T11:30:00Z", "end": "2014-12-23T12:00:00Z", "status": "OPEN",
                     "job_position": {"id": 2, "position": "update"},
                     "candidate": {"id": 2, "name": "update", "email": "test_1@test.com", "surname": "pes"},
                     "catalogue": 1}
        response = self.client.put("/dashboard/interviews/interviews/1/", interview, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        updated_candidate = Candidate.objects.get(pk=1)
        self.assertEqual(updated_candidate.name, "update")

    def test_use_can_update_job_info(self):
        self.client.force_authenticate(user=self.user)
        interview = {"id": 2, "start": "2014-12-23T11:30:00Z", "end": "2014-12-23T12:00:00Z", "status": "OPEN",
                     "job_position": {"id": 2, "position": "update"},
                     "candidate": {"id": 2, "name": "giuseppe", "email": "test_1@test.com", "surname": "pes"},
                     "catalogue": 1}
        response = self.client.put("/dashboard/interviews/interviews/1/", interview, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        updated_position = JobPosition.objects.get(pk=1)
        self.assertEqual(updated_position.position, "update")

    def test_user_can_delete_interview(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete("/dashboard/interviews/interviews/1/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Interview.objects.count(), 0)


