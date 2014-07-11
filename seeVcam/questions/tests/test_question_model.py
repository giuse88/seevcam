from django.test import TestCase

from questions.models import QuestionCatalogue, Question


class QuestionTest(TestCase):
    # #############################################################################
    #                                PROPERTIES                                  #
    ##############################################################################

    mock_catalogue_name = "catalogue_name"
    mock_catalogue_1 = None
    mock_catalogue_2 = None
    mock_questions_1 = []
    mock_questions_2 = []
    question_text_1 = "this is a question"
    question_text_2 = "this is a question"

    ##############################################################################
    #                                SETTING UP                                  #
    ##############################################################################

    def setUp(self):
        self.mock_catalogue_1 = QuestionCatalogue(pk=1, catalogue_name=self.mock_catalogue_name,
                                                  catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE)
        self.mock_catalogue_2 = QuestionCatalogue(pk=2, catalogue_name=self.mock_catalogue_name,
                                                  catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE)

        self.questions_1 = self._create_mock_questions(self.mock_catalogue_1, 10, self.question_text_1)
        self.questions_2 = self._create_mock_questions(self.mock_catalogue_2, 10, self.question_text_2)

    ##############################################################################
    #                                PUBLIC TESTS                                #
    ##############################################################################

    def test_creation_of_a_question(self):
        pass

    def test_get_all_question_in_a_catalogue(self):
        pass

    def test_no_null_question_is_allowed(self):
        pass

    def test_no_blank_test_is_allowed(self):
        pass

    ##############################################################################
    #                                   PRIVATE                                  #
    ##############################################################################

    def _create_mock_questions(self, catalogue, how_many_questions, text):
        questions = []
        for i in range(how_many_questions):
            questions.append(Question.objects.create(question_text=text, question_catalogue=catalogue))
        return questions
