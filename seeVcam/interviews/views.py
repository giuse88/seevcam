from django.views.generic import TemplateView
from common.mixins.authorization import LoginRequired
from common.mixins.pjax import PJAXResponseMixin


class InterviewsView(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = 'interviews.html'

