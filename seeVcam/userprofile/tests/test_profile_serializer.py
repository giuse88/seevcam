from django.test import TestCase
from rest_framework.renderers import JSONRenderer

from authentication.models import SeevcamUser
from userprofile.serializers import UserprofileSerializer


class UserprofileSerializerTest(TestCase):
    userprofile_json = '{"username": "tests", "email": "tests@email.com", "first_name": "test_first", "last_name": "test_last", "job_title": "test_title"}'


    def test_userprofile_deserialization(self):
        # start off from the json and you check that the created object has the correct fields.
        pass


    def test_userprofile_deserialization_invalid(self):
        # check well formed email field
        # check no empty field for user name
        pass


    def test_userprofile_serializer(self):
        # start off from the object and you check that the json created is correct

        userprofile = SeevcamUser.objects.create_user('tests', email='tests@email.com', password='test_pwd',
                                                      job_title='test_title', first_name='test_first',
                                                      last_name='test_last')
        serializer = UserprofileSerializer(userprofile)
        data = serializer.data
        self.assertEqual(data['username'], "tests")
        self.assertEqual(data['email'], "tests@email.com")
        self.assertEqual(data['first_name'], "test_first")
        self.assertEqual(data['last_name'], "test_last")
        self.assertEqual(data['job_title'], "test_title")
        self.assertEqual(JSONRenderer().render(data), self.userprofile_json)