from django.core.exceptions import ValidationError

from django.test import TestCase
from answers.models import Answer

from common.helpers.test_helper import create_user, create_company, create_catalogue, create_question, \
    create_job_position, create_uploaded_file, create_candidate, create_interview, create_notes


class TestAnswer(TestCase):

    def setUp(self):
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))
        self.interview = create_interview(self.user, self.catalogue, self.candidate, self.job_position)

    def tearDown(self):
        self.user.delete()
        self.catalogue.delete()
        self.question.delete()
        self.job_position.delete()
        self.company.delete()
        self.candidate.delete()
        self.interview.delete()

    def test_create_answer_model_with_answer(self):
        answer = Answer(pk=1, interview=self.interview, question=self.question, content='This is an answer')
        answer.save()
        answer_from_db = Answer.objects.get(pk=1)

        self.assertEqual(answer.content, answer_from_db.content, "Comparing text content")
        self.assertEqual(answer.interview, answer_from_db.interview, "Comparing interview object")

    def test_create_answer_model_with_rating(self):
        answer = Answer(pk=1, interview=self.interview, question=self.question, rating=3)
        answer.save()
        answer_from_db = Answer.objects.get(pk=1)

        self.assertEqual(answer.rating, answer_from_db.rating,  "Comparing rating content")
        self.assertEqual(answer.interview, answer_from_db.interview, "Comparing interview object")

    def test_create_answer_model_with_rating_and_content(self):
        answer = Answer(pk=1, interview=self.interview, question=self.question, rating=3, content='This is an answer')
        answer.save()
        answer_from_db = Answer.objects.get(pk=1)

        self.assertEqual(answer.content, answer_from_db.content, "Comparing text content")
        self.assertEqual(answer.rating, answer_from_db.rating,  "Comparing rating content")
        self.assertEqual(answer.interview, answer_from_db.interview, "Comparing interview object")

    def test_create_answer_with_invalid_rating(self):
        answer = Answer(pk=1, interview=self.interview, question=self.question, rating=1000)
        self.assertRaises(ValidationError, answer.full_clean)

