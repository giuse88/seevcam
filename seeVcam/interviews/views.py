
from django.views.generic import TemplateView, CreateView, ListView
from django.core.urlresolvers import reverse_lazy

from common.mixins.authorization import LoginRequired
from interviews.forms import CreateInterviewForm
from interviews.models import Interview


class InterviewsView(LoginRequired, ListView):
    template_name = 'interviews.html'




class CreateInterviewView(LoginRequired, CreateView):
    template_name = 'interviews-create.html'
    success_url = reverse_lazy('interviews')
    form_class = CreateInterviewForm

    def form_valid(self, form):
        form.instance.interview_owner = self.request.user
        form.instance.interview_status = Interview.OPEN
        form.save()
        return super(CreateInterviewView, self).form_valid(form)

