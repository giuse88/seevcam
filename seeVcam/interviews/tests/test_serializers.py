from django.test import TestCase
from rest_framework.compat import BytesIO
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer

from authentication.models import SeevcamUser
from common.helpers.test_helper import create_user, create_uploaded_file
from company_profile.models import Company
from interviews.models import Candidate, JobPosition, Interview
from interviews.serializers import CandidateSerializer, JobPositionSerializer, InterviewSerializer
from questions.models import QuestionCatalogue


class CandidateSerializerTest(TestCase):
    def setUp(self):
        self.company = Company(name="test")
        self.company.save()

        self.user = create_user(self.company, 'test@test.com', 'test')

        self.uploaded_file = create_uploaded_file(self.user)

        self.candidate = Candidate(pk=1, created_by=self.user, company=self.company,
                                   name='giuseppe', surname='pes', email='test@test.com', cv=self.uploaded_file)
        self.candidate.save()

        self.catalogue = QuestionCatalogue(catalogue_name='test', catalogue_owner=self.user)
        self.catalogue.save()

        self.job_position = JobPosition(pk=1, position='text', company=self.company, created_by=self.user,
                                        job_description=self.uploaded_file)
        self.job_position.save()

        self.interview = Interview(pk=1, status=Interview.OPEN, start='2014-12-23 11:30', end='2014-12-23 12:00',
                                   catalogue=self.catalogue, owner=self.user, candidate=self.candidate,
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

    # #############################################################################
    # PUBLIC TESTS                                #
    ##############################################################################

    def test_candidate_serializer(self):
        candidate_json = '{"id": 1, "name": "giuseppe", "email": "test@test.com", "surname": "pes", "cv": 1}'
        candidate = Candidate.objects.get(pk=1)
        serializer = CandidateSerializer(candidate)
        data = serializer.data
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['email'], "test@test.com")
        self.assertEqual(data['name'], 'giuseppe')
        self.assertEqual(data['surname'], 'pes')
        self.assertJSONEqual(JSONRenderer().render(data).decode('utf-8'), candidate_json)

    def test_candidate_deserializer(self):
        create_uploaded_file(self.user)
        candidate_json = b'{"id": 2, "name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv" : 2}'
        stream = BytesIO(candidate_json)
        data = JSONParser().parse(stream)
        serializer = CandidateSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_job_position_serialization(self):
        expected_data = {'id': 1, 'position': u'text', 'job_description': 1}
        job_position = JobPosition.objects.get(pk=1)
        serializer = JobPositionSerializer(job_position)
        data = serializer.data
        self.assertDictEqual(expected_data, data)
        self.assertJSONEqual(JSONRenderer().render(data).decode("utf-8"),
                             JSONRenderer().render(expected_data).decode("utf-8"))

    def test_job_position_deserialization(self):
        create_uploaded_file(self.user)
        job_spec_json = b'{"id": 2, "position": "text", "job_description": 2}'
        stream = BytesIO(job_spec_json)
        data = JSONParser().parse(stream)
        serializer = JobPositionSerializer(data=data)
        print(serializer.errors)
        self.assertTrue(serializer.is_valid())

    def test_interview_serializer(self):
        json = '{"id": 1, ' \
               ' "start": "2014-12-23T11:30:00.000000+00:00",' \
               ' "end": "2014-12-23T12:00:00.000000+00:00",' \
               ' "status": "OPEN", ' \
               ' "job_position": 1,' \
               ' "job_position_name": "text",' \
               ' "candidate": {"id": 1, "name": "giuseppe", "email": "test@test.com", "surname": "pes", "cv": 1},' \
               ' "catalogue": 4}'
        interview = Interview.objects.get(pk=1)
        serializer = InterviewSerializer(interview)
        data = serializer.data
        print(JSONRenderer().render(data).decode("utf-8"))
        self.assertJSONEqual(JSONRenderer().render(data).decode("utf-8"), json)

    def test_interview_deserialization(self):
        create_uploaded_file(self.user)
        json = b'{"id": 1, ' \
               b' "start": "2015-05-04T12:20:34.000343+00:00", ' \
               b' "end": "2015-05-04T12:21:34.000343+00:00", ' \
               b' "status": "OPEN", ' \
               b' "job_position": 1,' \
               b' "candidate": {"id": 1, "name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": 2},' \
               b' "catalogue": 1}'
        stream = BytesIO(json)
        data = JSONParser().parse(stream)
        serializer = InterviewSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_interview_deserialization_when_datetime_is_not_iso8610(self):
        create_uploaded_file(self.user)
        json = b'{"id": 1, ' \
               b' "start": "2014-12-23T11:30", ' \
               b' "end": "2014-12-23T12:00", ' \
               b' "status": "OPEN", ' \
               b' "job_position": 1,' \
               b' "candidate": {"id": 1, "name": "giuseppe", "email": "test_1@test.com", "surname": "pes", "cv": 2},' \
               b' "catalogue": 1}'
        stream = BytesIO(json)
        data = JSONParser().parse(stream)
        serializer = InterviewSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIsNotNone(serializer.errors['start'])
        self.assertEqual(serializer.errors['start'][0],
                         'Datetime has wrong format. Use one of these formats instead: YYYY-MM-DDThh:mm:ss.uuuuuu+00:00')
        self.assertIsNotNone(serializer.errors['end'])
        self.assertEqual(serializer.errors['end'][0],
                         'Datetime has wrong format. Use one of these formats instead: YYYY-MM-DDThh:mm:ss.uuuuuu+00:00')
