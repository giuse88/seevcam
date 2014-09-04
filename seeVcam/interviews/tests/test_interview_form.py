from StringIO import StringIO
from django.test import TestCase
from django.conf import settings
from authentication.models import SeevcamUser
from questions.models import QuestionCatalogue


class InterviewFormTest(TestCase):
    client = None
    INTERVIEW_CREATE = "/dashboard/interviews/create/"

    def setUp(self):
        self.user_1 = self._create_dummy_user('user_1', 'test')
        self.user_2 = self._create_dummy_user('user_2', 'test')
        self.test_file = self._create_file()
        self.catalogue = self._create_dummy_catalogue("test", self.user_1)

    def test_user_can_create_an_interview(self):
        self._log_in_dummy_user('user_1','test')
        data = {
            'candidate_email': "test@email.it",
            'candidate_name': "name",
            'candidate_surname': "surname",
            'candidate_cv': self.test_file,
            'interview_job_description': self.test_file,
            'interview_catalogue': self.catalogue.id,
            'interview_description': "test",
            'interview_date': '2014-12-23',
            'interview_time': "11:30"
        }
        response = self.client.post(self.INTERVIEW_CREATE, data, HTTP_X_REQUESTED_WITH='XMLHttpRequest')
        print response.status_code
        print response

    def test_data_validation(self):
        pass

    def test_time_validation(self):
        pass

    #Private

    def _create_file(self):
        test_file = StringIO('GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,\x00'
                             '\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
                             '\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
                             '\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
        test_file.name = 'test.bin'
        return test_file

    def _log_in_dummy_user(self, username, password):
        self.client.post(settings.LOGIN_URL, {'username': username, 'password': password})

    def _create_dummy_user(self, username, password):
        user = SeevcamUser.objects.create_user(username, password=password)
        user.save()
        return user

    def _create_dummy_catalogue(self, name, user):
        catalogue = QuestionCatalogue(catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE,
                                      catalogue_name=name, catalogue_owner=user)
        catalogue.save()
        return catalogue
