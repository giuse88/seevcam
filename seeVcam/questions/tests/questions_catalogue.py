from unittest import skip
from django.test import TestCase

from questions.models import QuestionCatalogue
from authentication.models import SeevcamUser


class QuestionCatalogueTest(TestCase):
    # #############################################################################
    #                                PROPERTIES                                  #
    ##############################################################################

    mock_catalogue_name = "catalogue_name"
    mock_catalogue_scope = QuestionCatalogue.PRIVATE_SCOPE
    mock_username_1 = "catalogue_owner_1"
    mock_username_2 = "catalogue_owner_2"
    mock_user_1 = None
    mock_user_2 = None
    how_many_catalogues = 10

    ##############################################################################
    #                                SETTING UP                                  #
    ##############################################################################

    def setUp(self):
        self.mock_user_1 = self._create_user_and_his_catalogue(self.mock_username_1,
                                                               range(self.how_many_catalogues))
        self.mock_user_2 = self._create_user_and_his_catalogue(self.mock_username_2,
                                                               range(self.how_many_catalogues,
                                                                     self.how_many_catalogues + 5))

    ##############################################################################
    #                                PUBLIC TESTS                                #
    ##############################################################################

    def test_the_creation_of_an_empty_catalogue(self):
        """
        Basic tests to verify that a catalogue is correctly created
        """
        catalogue = QuestionCatalogue.objects.get(pk=1)
        self.assertEqual(catalogue.catalogue_name, self.mock_catalogue_name)
        self.assertEqual(catalogue.catalogue_scope, self.mock_catalogue_scope)
        self.assertEqual(catalogue.catalogue_owner.username, self.mock_username_1)

    def test_filtering_catalogues_by_users(self):
        """
        Test that there are exactly 10 catalogues belonging to each mock user
        """
        self._verify_user_catalogues(self.mock_user_1, self.how_many_catalogues)
        self._verify_user_catalogues(self.mock_user_2, 5)

    @skip('scope can assume any value so far. Need to find a better mechanism to enforce this concept')
    def test_incorrect_value_set_in_the_scope(self):
        QuestionCatalogue.objects.create(catalogue_scope="error",
                                         catalogue_name=self.mock_catalogue_name,
                                         catalogue_owner=self.mock_user_1,
                                         pk=90)

    def test_null_user_value_for_seevcam_catalogues(self):
        QuestionCatalogue.objects.create(catalogue_name=self.mock_catalogue_name,
                                         catalogue_scope=QuestionCatalogue.SEEVCAM_SCOPE, pk=90)
        catalogue = QuestionCatalogue.objects.get(pk=90)
        self.assertIsNone(catalogue.catalogue_owner)

    ##############################################################################
    #                                   PRIVATE                                  #
    ##############################################################################

    def _create_user_and_his_catalogue(self, username, keys_range):
        """
        Create a user and his private catalogue
        """
        mock_user = SeevcamUser.objects.create(username=username)
        for i in keys_range:
            QuestionCatalogue.objects.create(catalogue_scope=self.mock_catalogue_scope,
                                             catalogue_name=self.mock_catalogue_name,
                                             catalogue_owner=mock_user,
                                             pk=i)
        return mock_user

    def _verify_user_catalogues(self, user, how_many_catalogues):
        catalogues = QuestionCatalogue.objects.filter(catalogue_owner=user)
        self.assertEqual(catalogues.count(), how_many_catalogues)
        for catalogue in catalogues:
            self.assertEqual(catalogue.catalogue_name, self.mock_catalogue_name)
            self.assertEqual(catalogue.catalogue_scope, self.mock_catalogue_scope)
            self.assertEqual(catalogue.catalogue_owner.username, user.username)
