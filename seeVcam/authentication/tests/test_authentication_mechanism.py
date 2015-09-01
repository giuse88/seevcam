from django.test import TestCase, Client
from rest_framework import status

from django.conf import settings
from common.helpers.test_helper import create_user, create_company


class AuthenticationTest(TestCase):

    DASHBOARD_URL = '/dashboard/'

    def setUp(self):
        self.user = create_user(create_company())
        self.client = Client()

    def test_dashboard_cannot_be_access_by_unauthenticated_user(self):
        response = self.client.get(self.DASHBOARD_URL)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)

    def test_dashboard_cannot_be_access_by_unauthenticated_user_redirect_to_login(self):
        response = self.client.get(self.DASHBOARD_URL, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.request['PATH_INFO'], settings.LOGIN_URL)

    def test_unauthenticated_user_is_redirect_to_login_page(self):
        response = self.client.get(self.DASHBOARD_URL, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.request['PATH_INFO'], settings.LOGIN_URL)

    def test_dashboard_can_be_access_by_a_authenticated_user(self):
        self._log_in_dummy_user("giuseppe", "password")
        response = self.client.get(self.DASHBOARD_URL, follow=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def _log_in_dummy_user(self, username, password):
        self.client.post(settings.LOGIN_URL, {'username': username, 'password': password})
