from django.views.generic import CreateView, ListView, UpdateView
from common.mixins.authorization import LoginRequired
from common.mixins.pjax import PJAXResponseMixin
from interviews.models import Interview
import datetime
from common.helpers.timezone import to_user_timezone
import pdb


class ReportView(LoginRequired, ListView):
    template_name = "reports.html"
    context_object_name = 'reports_list'

    def get_queryset(self):
        reports = Interview.objects.filter(interview_owner=self.request.user.id,interview_status='CLOSED').order_by('interview_datetime')[:9]
        if ('search' in self.request.GET) and (self.request.GET['search']!=''):
            return [report for report in reports if self.request.GET['search'].upper() in report.interview_description.upper()][:9]
        else:
            return reports


    def get_context_data(self, **kwargs):
        context = super(ReportView, self).get_context_data(**kwargs)

        self.upcoming_interviews = Interview.objects.filter(interview_owner=self.request.user.id,interview_datetime__gt=datetime.datetime.now()).order_by('interview_datetime')[:4]

        # Check if we have an interview in the following hour (pending interview)
        dt = (self.upcoming_interviews[0].interview_datetime-to_user_timezone(datetime.datetime.now(),self.request.user))

        if dt.total_seconds() < 3600:
            context['interview_pending'] = [self.upcoming_interviews[0]]
        else:
            context['interview_pending'] = []

        # Upcoming Interviews
        if len(context['interview_pending']):
            context['upcoming_interviews'] = self.upcoming_interviews[1:][:3]
        else:
            context['upcoming_interviews'] = self.upcoming_interviews[:3]

        return context

class GridReportView(ReportView):
    template_name = "reports-grid.html"

class ListReportView(ReportView):
    template_name = "reports-list.html"

