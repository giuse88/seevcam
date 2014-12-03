from django.test import TestCase

from authentication.models import SeevcamUser
from interviews.models import Interview
from notes.models import Notes
from questions.models import QuestionCatalogue


class TestInterviewModel(TestCase):
    def setUp(self):
        self.user_1 = self._create_dummy_user('user_1', 'password')
        self.catalogue = self._create_dummy_catalogue('catalogue', self.user_1)
        self.file_path = "test-file/test-file.txt"


    def _test_interview_creation_without_catalogue(self):
        interview = Interview(pk=1, interview_owner=self.user_1,
                              candidate_email="test@email.it",
                              candidate_name="name",
                              candidate_surname="surname",
                              candidate_cv=self.file_path,
                              interview_job_description=self.file_path,
                              interview_position="position",
                              interview_description="test",
                              interview_datetime="2014-12-23 11:30",
                              interview_duration=15,
                              interview_datetime_end="2014-12-23 11:45")
        interview.save()
        db_interview = Interview.objects.get(pk=1)
        self.assertEqual(interview, db_interview)
        self.assertEqual(interview.candidate_name, db_interview.candidate_name)
        self.assertEqual(interview.candidate_surname, db_interview.candidate_surname)
        self.assertEqual(interview.candidate_email, db_interview.candidate_email)
        self.assertEqual(interview.candidate_cv, db_interview.candidate_cv)
        self.assertEqual(db_interview.interview_status, Interview.OPEN)

    def _test_interview_creation_with_catalogue(self):
        interview = Interview(pk=1, interview_owner=self.user_1,
                              candidate_email="test@email.it",
                              candidate_name="name",
                              candidate_surname="surname",
                              candidate_cv=self.file_path,
                              interview_job_description=self.file_path,
                              interview_catalogue=self.catalogue,
                              interview_position="position",
                              interview_description="test",
                              interview_datetime="2014-12-23 11:30",
                              interview_duration=15,
                              interview_datetime_end="2014-12-23 11:45")
        interview.save()
        db_interview = Interview.objects.get(pk=1)
        self.assertEqual(interview, db_interview)
        self.assertEqual(interview.candidate_name, db_interview.candidate_name)
        self.assertEqual(interview.candidate_surname, db_interview.candidate_surname)
        self.assertEqual(interview.candidate_email, db_interview.candidate_email)
        self.assertEqual(interview.candidate_cv, db_interview.candidate_cv)
        self.assertEqual(db_interview.interview_catalogue.catalogue_scope, QuestionCatalogue.SEEVCAM_SCOPE)
        self.assertEqual(db_interview.interview_catalogue.catalogue_name, "catalogue")

    def test_that_a_note_object_is_created_when_a_interview_is_created(self):
        interview = Interview(pk=1, interview_owner=self.user_1,
                              candidate_email="test@email.it",
                              candidate_name="name",
                              candidate_surname="surname",
                              candidate_cv=self.file_path,
                              interview_job_description=self.file_path,
                              interview_catalogue=self.catalogue,
                              interview_position="position",
                              interview_description="test",
                              interview_datetime="2014-12-23 11:30",
                              interview_duration=15,
                              interview_datetime_end="2014-12-23 11:45")
        interview.save()
        db_interview = Interview.objects.get(pk=1)
        notes = Notes.objects.find(interview=db_interview)
        self.assertIsNotNone(notes, "Retrieving notes objects")

    def _create_dummy_user(self, username, password):
        user = SeevcamUser.objects.create_user(username, password=password)
        user.save()
        return user

    def _create_dummy_catalogue(self, name, user):
        catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                      catalogue_name=name, catalogue_owner=user)
        catalogue.save()
        return catalogue


