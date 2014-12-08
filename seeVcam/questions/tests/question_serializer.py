from django.test import TestCase
from rest_framework.compat import BytesIO
from rest_framework.parsers import JSONParser
from rest_framework.renderers import JSONRenderer
from authentication.models import SeevcamUser
from company_profile.models import Company

from questions.serializers import QuestionSerializer
from questions.models import Question, QuestionCatalogue


class QuestionSerializerTest(TestCase):
    ##############################################################################
    #                                PROPERTIES                                  #
    ##############################################################################

    # The json must be in strict mode
    question_catalogue = None
    question = None

    ##############################################################################
    #                                SETTING UP                                  #
    ##############################################################################

    def setUp(self):

        self.question_catalogue = QuestionCatalogue(pk=1, catalogue_scope='private', catalogue_name='tests')
        self.question_catalogue.save()
        question = Question(pk=1, question_text="text", question_catalogue=self.question_catalogue)
        question.save()

    ##############################################################################
    #                                PUBLIC TESTS                                #
    ##############################################################################

    def test_question_deserializer_valid_json(self):
        question_json = '{"id": 2, "question_text": "text", "question_catalogue": 1}'
        stream = BytesIO(question_json)
        data = JSONParser().parse(stream)
        serializer = QuestionSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        question = serializer.object
        question.save()
        #
        question_from_db = Question.objects.get(pk=2)
        self.assertEqual(question.question_text, "text")
        self.assertEqual(question_from_db.question_text, "text")
        #
        self.assertTrue(type(question.question_catalogue) is QuestionCatalogue)
        self.assertEqual(question.question_catalogue.pk, self.question_catalogue.pk)
        self.assertEqual(question.question_catalogue.catalogue_name, self.question_catalogue.catalogue_name)
        #
        self.assertTrue(type(question_from_db.question_catalogue) is QuestionCatalogue)
        self.assertEqual(question_from_db.question_catalogue.pk, self.question_catalogue.pk)
        self.assertEqual(question_from_db.question_catalogue.catalogue_name, self.question_catalogue.catalogue_name)

    def test_question_deserializer_invalid_json(self):
        question_json = '{"question_catalogue": 1}'
        stream = BytesIO(question_json)
        data = JSONParser().parse(stream)
        serializer = QuestionSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    def test_question_serializer(self):
        question_json = '{"id": 1, "question_text": "text", "question_catalogue": 1}'
        question = Question.objects.get(pk=1)
        serializer = QuestionSerializer(question)
        data = serializer.data
        self.assertEqual(data['id'], 1)
        self.assertEqual(data['question_text'], "text")
        self.assertEqual(data['question_catalogue'], self.question_catalogue.id)
        self.assertEqual(JSONRenderer().render(data), question_json)

