from django.test import TestCase
from authentication.models import SeevcamUser
from common.helpers.test_helper import create_company


class UserTest(TestCase):

    def test_creation_of_a_seevcamuser(self):
        company = create_company()
        user = SeevcamUser.objects.create_user("test@test.com",  'test_pwd', company)
        user.save()
        user_from_db = SeevcamUser.objects.get(pk=user.id)
        self.assertEqual('test@test.com', user_from_db.email)
