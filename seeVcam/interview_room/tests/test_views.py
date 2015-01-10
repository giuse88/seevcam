import datetime
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from authentication.models import SeevcamUser
from common.helpers.test_helper import create_user, create_uploaded_file, create_interview, create_candidate, \
    create_job_position, create_question, create_catalogue, create_company, login_user
from common.helpers.timezone import now_timezone
from company_profile.models import Company
from interview_room.views import InterviewRoomView
from interviews.models import Candidate, JobPosition, Interview
from interviews.rest_views import InterviewList


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
        InterviewList.create_interview_session = lambda x: "test_session"
        InterviewRoomView.generate_opentok_token = lambda x, y: "test_token"

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

    def test_interviewee_can_access_the_interview_room(self):
        response = self.client.get("/interview/1/" + str(self.interview.id) + "/" + str(self.interview.token))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_interviewee_cannot_access_the_interview_room_without_the_authentication_token(self):
        response = self.client.get("/interview/1/" + str(self.interview.id) + "/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_interviewee_cannot_access_the_interview_room_with_an_incorrect_token(self):
        response = self.client.get("/interview/1/" + str(self.interview.id) + "/1234")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_interviewee_cannot_access_closed_room(self):
        response = self.client.get("/interview/1/" + str(self.interview.id) + "/" + str(self.interview.token))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.context_data['is_interview_open'])

    def test_interviewee_can_access_open_room(self):
        self.interview.start = now_timezone()
        self.interview.end = now_timezone() + datetime.timedelta(hours=1)
        self.interview.save()
        response = self.client.get("/interview/1/" + str(self.interview.id) + "/" + str(self.interview.token))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.context_data['is_interview_open'])

    def test_interviewer_can_access_the_interview_room(self):
        login_user(self.client)
        response = self.client.get("/interview/0/" + str(self.interview.id) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_interviewer_cannot_access_closed_room(self):
        login_user(self.client)
        self.client.force_authenticate(user=self.user)
        response = self.client.get("/interview/0/" + str(self.interview.id) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.context_data['is_interview_open'])

    def test_interviewer_can_access_open_room(self):
        login_user(self.client)
        self.interview.start = now_timezone()
        self.interview.end = now_timezone() + datetime.timedelta(hours=1)
        self.interview.save()
        response = self.client.get("/interview/0/" + str(self.interview.id) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.context_data['is_interview_open'])

    def test_interviewer_cannot_access_the_interview_room_if_not_logged_in(self):
        response = self.client.get("/interview/0/" + str(self.interview.id) + "/")
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
