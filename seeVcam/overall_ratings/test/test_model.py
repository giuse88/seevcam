from django.test import TestCase
from common.helpers.test_helper import create_user, create_company, create_catalogue, create_question, \
    create_job_position, create_uploaded_file, create_candidate, create_interview, \
    create_overall_rating_question
from overall_ratings.models import OverallRatingQuestion, OverallRating


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

    def test_create_overall_rating_question(self):
        overall_question = OverallRatingQuestion(pk=1, question='question for overall rating')
        overall_question.save()
        overall_question_from_db = OverallRatingQuestion.objects.get(pk=1)
        self.assertEqual(overall_question.question, overall_question_from_db.question, "Comparing text content")

    def test_create_overall_rating(self):
        overall_question = OverallRating(pk=1,
                                         question=create_overall_rating_question(),
                                         interview=self.interview,
                                         rating=1)
        overall_question.save()
        overall_question_from_db = OverallRating.objects.get(pk=1)
        self.assertEqual(overall_question.id, overall_question_from_db.id, "Comparing text content")
        self.assertEqual(overall_question.question, overall_question_from_db.question, "Comparing text content")
        self.assertEqual(overall_question.interview_id, overall_question_from_db.interview_id, "Comparing interview id")
