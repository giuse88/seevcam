from django.test import TestCase
from rest_framework.compat import BytesIO
from rest_framework.parsers import JSONParser

from questions.serializers import QuestionSerializer
from questions.models import QuestionCatalogue


class QuestionSerializerTest(TestCase):
    ##############################################################################
    #                                PROPERTIES                                  #
    ##############################################################################

    # The json must be in strict mode
    question_catalogue = None

    ##############################################################################
    #                                SETTING UP                                  #
    ##############################################################################

    def setUp(self):
        self.question_catalogue = QuestionCatalogue(pk=1, catalogue_scope='private', catalogue_name='test')
        self.question_catalogue.save()

    ##############################################################################
    #                                PUBLIC TESTS                                #
    ##############################################################################

    def test_question_catalogue_deserializer_valid_json(self):
        catalogue_json = '{"id": 2, "catalogue_scope": "SEEVCAM", "catalogue_name": "cat"}'
        stream = BytesIO(catalogue_json)
        data = JSONParser().parse(stream)
        question_catalogue_serializer = QuestionSerializer(data=data)
        self.assertFalse(question_catalogue_serializer.is_valid())


    def test_question_catalogue_deserializer_invalid_json(self):
        pass

    def test_question_catalogue_serializer(self):
        pass

    def test_question_catalogue_invalid_scope(self):
        catalogue_json = '{"id": 2, "catalogue_scope": "wrong", "catalogue_name": "cat"}'
        stream = BytesIO(catalogue_json)
        data = JSONParser().parse(stream)
        question_catalogue_serializer = QuestionSerializer(data=data)
        self.assertFalse(question_catalogue_serializer.is_valid())

