from unittest import skip

from django.db import IntegrityError

from django.test import TestCase

from questions.models import QuestionCatalogue, Question


class QuestionTest(TestCase):
    ##############################################################################
    # PROPERTIES                                                                 #
    ##############################################################################

    mock_catalogue_name = "catalogue_name"
    mock_catalogue_1 = None
    mock_catalogue_2 = None
    mock_questions_1 = []
    mock_questions_2 = []
    question_text_1 = "this is a question"
    question_text_2 = "this is a question"

    ##############################################################################
    # SETTING UP                                                                 #
    ##############################################################################

    def setUp(self):
        self.mock_catalogue_1 = QuestionCatalogue(pk=1, catalogue_name=self.mock_catalogue_name,
                                                  catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE)
        self.mock_catalogue_2 = QuestionCatalogue(pk=2, catalogue_name=self.mock_catalogue_name,
                                                  catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE)
        self.mock_catalogue_1.save()
        self.mock_catalogue_2.save()
        self.questions_1 = self._create_mock_questions(self.mock_catalogue_1, 10, self.question_text_1)
        self.questions_2 = self._create_mock_questions(self.mock_catalogue_2, 10, self.question_text_2)

    ##############################################################################
    #                                PUBLIC TESTS                                #
    ##############################################################################

    def test_creation_of_a_question(self):
        question = Question.objects.get(pk=1)
        self.assertEqual(question.question_text, self.question_text_1)
        self.assertEqual(question.question_catalogue.id, self.mock_catalogue_1.id)

    def test_get_all_question_in_a_catalogue(self):
        questions = Question.objects.filter(question_catalogue=self.mock_catalogue_1)
        self.assertEqual(10, questions.count())
        questions = Question.objects.filter(question_catalogue=self.mock_catalogue_2)
        self.assertEqual(10, questions.count())

    def test_no_null_question_is_allowed(self):
        self.assertRaises(IntegrityError,
                          lambda: Question.objects.create(question_text=None,
                                                          question_catalogue=self.mock_catalogue_1))

    @skip('blank=False only affects forms.')
    def test_no_blank_test_is_allowed(self):
        self.assertRaises(IntegrityError,
                          lambda: Question.objects.create(question_text='',
                                                          question_catalogue=self.mock_catalogue_1))

    ##############################################################################
    #                                   PRIVATE                                  #
    ##############################################################################

    def _create_mock_questions(self, catalogue, how_many_questions, text):
        questions = []
        for i in range(how_many_questions):
            question = Question.objects.create(question_text=text, question_catalogue=catalogue)
            question.save()
            questions.append(question)
        return questions
