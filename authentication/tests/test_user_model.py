from django.test import TestCase
from authentication.models import SeevcamUser


class UserTest(TestCase):
    def setUp(self):
        pass

    def test_creation_of_a_seevcamuser(self):
        user = SeevcamUser.objects.create_user('test_username', email=None, password='test_pwd',
                                               job_title='test_job_title', first_name='test_first_name',
                                               last_name='test_last_name', pk=1)
        user.save()
        user_from_db = SeevcamUser.objects.get(pk=1)
        self.assertEqual('test_username', user_from_db.username)
        self.assertEqual('test_job_title', user_from_db.job_title)
        self.assertEqual('test_first_name', user_from_db.first_name)
        self.assertEqual('test_last_name', user_from_db.last_name)
