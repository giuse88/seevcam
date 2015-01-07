from django.test import TestCase

from common.helpers.test_helper import create_company, create_user, create_catalogue, create_question, \
    create_job_position, create_candidate, create_uploaded_file
from interviews.models import Interview
from questions.models import QuestionCatalogue


class TestInterviewModel(TestCase):
    def setUp(self):
        self.company = create_company()
        self.user = create_user(self.company)
        self.catalogue = create_catalogue(self.user)
        self.question = create_question(self.catalogue)
        self.job_position = create_job_position(self.user, self.company, create_uploaded_file(self.user))
        self.candidate = create_candidate(self.user, self.company, create_uploaded_file(self.user))

    def test_interview_creation_with_catalogue(self):
        interview = Interview(pk=1, status=Interview.OPEN,
                              start='2015-05-04T12:20:34.000343+00:00',
                              end='2015-05-04T13:20:34.000343+00:00',
                              catalogue=self.catalogue, owner=self.user, candidate=self.candidate,
                              job_position=self.job_position)
        interview.save()
        db_interview = Interview.objects.get(pk=1)
        self.assertEqual(interview, db_interview)
        self.assertEqual(interview.candidate.name, db_interview.candidate.name)
        self.assertEqual(interview.candidate.surname, db_interview.candidate.surname)
        self.assertEqual(interview.candidate.email, db_interview.candidate.email)
        self.assertEqual(interview.candidate.cv, db_interview.candidate.cv)
        self.assertEqual(db_interview.catalogue.catalogue_scope, QuestionCatalogue.SEEVCAM_SCOPE)
        self.assertEqual(db_interview.catalogue.catalogue_name, "test catalogue")


