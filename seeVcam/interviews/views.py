from django.views.generic import TemplateView, CreateView
from common.mixins.authorization import LoginRequired
from common.mixins.pjax import PJAXResponseMixin
from interviews.models import Interview
from django.core.urlresolvers import reverse_lazy, reverse


class InterviewsView(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = 'interviews.html'


class CreateInterviewView(LoginRequired, PJAXResponseMixin, CreateView):
    template_name = 'interviews-create.html'
    # success_url = reverse('interviews')
    model = Interview
    fields = ['candidate_name', 'candidate_surname', 'candidate_email', 'candidate_cv',
              'interview_date', 'interview_time', 'interview_description', 'interview_catalogue',
              'interview_job_description']
