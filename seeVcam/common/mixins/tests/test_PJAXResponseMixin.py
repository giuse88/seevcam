from django.test import TestCase
from django.test.client import RequestFactory
from rest_framework.compat import View

from common.mixins.pjax import PJAXResponseMixin


class TestPJAXResponseMixin(TestCase):

    request_factory = None
    TEMPLATE_NAME = "template.html"
    TEMPLATE_NAME_WITH_PJAX = "template-pjax.html"
    TEMPLATE_NAME_WITH_PJAX_WITH_CONTAINER = "template-container-pjax.html"

    def setUp(self):
        self.request_factory = RequestFactory()

    ##################################################

    def test_regular_request(self):
        regular_request = self.request_factory.get('/')
        response = self._make_request(regular_request)
        self.assertEqual(response.template_name[0], self.TEMPLATE_NAME)

    def test_pjax_request_without_container(self):
        pjax_request = self.request_factory.get('/', HTTP_X_PJAX=True)
        response = self._make_request(pjax_request)
        self.assertEqual(response.template_name[0], self.TEMPLATE_NAME_WITH_PJAX)

    def test_pjax_request_with_container(self):
        pjax_request = self.request_factory.get('/', HTTP_X_PJAX=True, HTTP_X_PJAX_Container="#container")
        response = self._make_request(pjax_request)
        self.assertEqual(response.template_name[0], self.TEMPLATE_NAME_WITH_PJAX_WITH_CONTAINER)

    ##################################################

    def _make_request(self, request):
        view = PJAXTemplateView.as_view()
        return view(request)


class PJAXTemplateView(PJAXResponseMixin, View):
    template_name = TestPJAXResponseMixin.TEMPLATE_NAME

    def get(self, request):
        return self.render_to_response({})
