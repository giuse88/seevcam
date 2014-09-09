from django.views.generic import CreateView, ListView
from django.core.urlresolvers import reverse_lazy

from common.mixins.authorization import LoginRequired
from interviews.forms import CreateInterviewForm
from interviews.models import Interview


class InterviewsView(LoginRequired, ListView):
    template_name = 'interviews.html'

    def get_queryset(self):
        return Interview.objects.filter(interview_owner=self.request.user.id). \
            order_by('interview_date', 'interview_time')


class CreateInterviewView(LoginRequired, CreateView):
    template_name = 'interviews-create.html'
    success_url = reverse_lazy('interviews')
    form_class = CreateInterviewForm

    def form_valid(self, form):
        form.instance.interview_owner = self.request.user
        form.instance.interview_status = Interview.OPEN
        form.save()
        return super(CreateInterviewView, self).form_valid(form)

    def get_form_kwargs(self):
        kwargs = super(CreateInterviewView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs
