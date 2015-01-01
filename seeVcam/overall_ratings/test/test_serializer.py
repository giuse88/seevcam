from django.test import TestCase
from io import BytesIO
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from common.helpers.test_helper import create_user, create_company, create_catalogue, create_question, \
    create_job_position, create_uploaded_file, create_candidate, create_interview, \
    create_overall_rating_question, create_overall_rating
from overall_ratings.serializer import OverallRatingSerializer


class TestAnswer(TestCase):

    def setUp(self):
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))
        self.interview = create_interview(self.user, self.catalogue, self.candidate, self.job_position)
        self.overall_rating = create_overall_rating(self.interview, create_overall_rating_question())

    def tearDown(self):
        self.user.delete()
        self.catalogue.delete()
        self.question.delete()
        self.job_position.delete()
        self.company.delete()
        self.candidate.delete()
        self.interview.delete()

    def test_serialization_overall_rating(self):
        serializer = OverallRatingSerializer(self.overall_rating)
        data = serializer.data
        expected_data = {'id': 1, 'rating': 1, 'question': 'this is a question for overall rating'}
        self.assertDictEqual(expected_data, data)
        self.assertJSONEqual(JSONRenderer().render(data), JSONRenderer().render(expected_data))

    def test_deserialization_overall_rating(self):
        stream = BytesIO('{"id": 1, "rating": 1, "question": "this is a question for overall rating"}')
        data = JSONParser().parse(stream)
        serializer = OverallRatingSerializer(data=data)
        self.assertTrue(serializer.is_valid())
