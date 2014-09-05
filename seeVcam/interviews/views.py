from django.views.generic import TemplateView, CreateView
from common.mixins.authorization import LoginRequired
from common.mixins.pjax import PJAXResponseMixin
from interviews.models import Interview
from django.core.urlresolvers import reverse_lazy, reverse

class InterviewsView(LoginRequired, PJAXResponseMixin, TemplateView):
    template_name = 'interviews.html'


class CreateInterviewView(LoginRequired, CreateView):
    template_name = 'interviews-create.html'
    success_url = reverse_lazy('interviews')

    def form_valid(self, form):
        form.instance.interview_owner = self.request.user
        form.interview_status = Interview.OPEN
        form.save()
        return super(CreateInterviewView, self).form_valid(form)

    model = Interview
    fields = ['candidate_name', 'candidate_surname', 'candidate_email', 'candidate_cv',
              'interview_date', 'interview_time', 'interview_description', 'interview_catalogue',
              'interview_job_description']
