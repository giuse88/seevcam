from django.test import TestCase
from rest_framework.compat import BytesIO
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer

from authentication.models import SeevcamUser
from common.helpers.test_helper import create_dummy_user
from company_profile.models import Company
from interviews.models import Candidate, JobPosition, Interview
from interviews.serializers import CandidateSerializer, JobPositionSerializer, InterviewSerializer
from questions.models import QuestionCatalogue


class CandidateSerializerTest(TestCase):
    # #############################################################################
    #                                PROPERTIES                                  #
    ##############################################################################

    # The json must be in strict mode
    question_catalogue = None

    ##############################################################################
    #                                SETTING UP                                  #
    ##############################################################################

    def setUp(self):

        self.company = Company(name="test")
        self.company.save()

        self.user = create_dummy_user('test@test.com', company=self.company, password='test')

        self.candidate = Candidate(pk=1, created_by=self.user, company=self.company,
                                   name='giuseppe', surname='pes', email='test@test.com', cv=None)
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

    def test_candidate_serializer(self):
        candidate_json = '{"id": 1, "name": "giuseppe", "email": "test@test.com", "surname": "pes"}'
        candidate = Candidate.objects.get(pk=1)
        serializer = CandidateSerializer(candidate)
        data = serializer.data
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['email'], "test@test.com")
        self.assertEqual(data['name'], 'giuseppe')
        self.assertEqual(data['surname'], 'pes')
        self.assertEqual(JSONRenderer().render(data), candidate_json)

    def test_candidate_deserializer(self):
        candidate_json = '{"id": 2, "name": "giuseppe", "email": "test_1@test.com", "surname": "pes"}'
        stream = BytesIO(candidate_json)
        data = JSONParser().parse(stream)
        serializer = CandidateSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        # candidate = serializer.object
        # I can't save in the db because some parts are missing
        # candidate.save()

    def test_job_position_serialization(self):
        expected_data = {'id': 1, 'position': u'text'}
        job_position = JobPosition.objects.get(pk=1)
        serializer = JobPositionSerializer(job_position)
        data = serializer.data
        self.assertDictEqual(expected_data, data)
        self.assertJSONEqual(JSONRenderer().render(data), JSONRenderer().render(expected_data))

    def test_job_position_deserialization(self):
        job_spec_json = '{"id": 2, "position": "text"}'
        stream = BytesIO(job_spec_json)
        data = JSONParser().parse(stream)
        serializer = JobPositionSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_interview_serializer(self):
        json = '{"id": 1, "start": "2014-12-23T11:30:00Z", "end": "2014-12-23T12:00:00Z", "status": "OPEN", "job_position": {"id": 1, "position": "text"}, "candidate": {"id": 1, "name": "giuseppe", "email": "test@test.com", "surname": "pes"}, "catalogue": 1}'
        interview = Interview.objects.get(pk=1)
        serializer = InterviewSerializer(interview)
        data = serializer.data
        self.assertJSONEqual(JSONRenderer().render(data), json)

    def test_interview_deserialization(self):
        json = '{"id": 1, "start": "2014-12-23T11:30:00Z", "end": "2014-12-23T12:00:00Z", "status": "OPEN", "job_position": {"id": 1, "position": "text"}, "candidate": {"id": 1, "name": "giuseppe", "email": "test_1@test.com", "surname": "pes"}, "catalogue": 1}'
        stream = BytesIO(json)
        data = JSONParser().parse(stream)
        serializer = InterviewSerializer(data=data)
        self.assertTrue(serializer.is_valid())
