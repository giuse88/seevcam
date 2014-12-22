import json

import datetime
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.views.generic import CreateView, ListView, UpdateView, View
from django.core.urlresolvers import reverse_lazy

from common.mixins.authorization import LoginRequired
from interviews.forms import CreateInterviewForm
from interviews.models import Interview
from common.helpers.timezone import to_user_timezone
from seeVcam.settings.base import INTERVIEW_TEMPORAL_WINDOW
DAY = 86400


class InterviewsView(LoginRequired, ListView):
    template_name = 'interviews.html'
    interviews = []

    def today_interviews(self):
        today_interviews = []
        counter = 0
        for interview in self.interviews:
            dt = (interview.interview_datetime - to_user_timezone(datetime.datetime.now(), self.request.user))
            if dt.total_seconds() <= DAY and counter < 3:
                today_interviews.append(self.interviews[0])
                self.interviews.pop(0)
                counter += 1
            else:
                break
        return today_interviews

    def open_interview(self):
        dt = (self.interviews[0].interview_datetime - to_user_timezone(datetime.datetime.now(), self.request.user))
        interview = None
        if dt.total_seconds() < INTERVIEW_TEMPORAL_WINDOW:
            interview = self.interviews[0]
            self.interviews.pop(0)
        return interview

    def get_queryset(self):
        return Interview.objects.filter(
            interview_owner=self.request.user.id,
            interview_datetime__gt=datetime.datetime.now()) \
            .order_by('interview_datetime')

    def get_context_data(self, **kwargs):
        context = super(InterviewsView, self).get_context_data(**kwargs)

        if len(self.object_list) is 0:
            return context

        self.interviews = list(self.object_list)
        context['open_interview'] = self.open_interview()
        context['today_interviews'] = self.today_interviews()
        context['interviews'] = self.interviews

        # # Interviews filtered with search box
        # if ('search' in self.request.GET) and (self.request.GET['search'] != ''):
        #
        # search_query = self.request.GET['search']
        #
        #     # check if we are searching a date
        #     date_formats = ['%m-%d-%Y', '%Y-%m-%d', '%Y', '%d %B', '%B %d']
        #     search_is_date = False
        #
        #     for date_format in date_formats:
        #         try:
        #             match = time.strptime(search_query, date_format)
        #         except ValueError:
        #             continue
        #         search_is_date = True
        #         search_year = search_month = search_day = True
        #         if date_format == '%Y':
        #             search_day = search_month = False
        #         elif date_format == '%d %B' or date_format == '%B %d':
        #             search_year = False
        #
        #     if search_is_date:
        #         # we are searching a date
        #         context['interviews_filter'] = [interview for interview in self.interviews \
        #                                         if
        #                                         (not search_year or match.tm_year == interview.interview_datetime.year) \
        #                                         and (
        #                                         not search_month or match.tm_mon == interview.interview_datetime.month) \
        #                                         and (
        #                                         not search_day or match.tm_mday == interview.interview_datetime.day)][
        #                                        :9]
        #     else:
        #         # we are searching for description
        #         context['interviews_filter'] = [interview for interview in self.interviews if
        #                                         search_query.upper() in interview.interview_description.upper()][:9]
        # elif len(context['interview_pending']):
        #     context['interviews_filter'] = self.interviews[4:][:9]
        # else:
        #     context['interviews_filter'] = self.interviews[3:][:9]

        return context


class GridInterviewsView(InterviewsView):
    template_name = 'interviews-grid.html'


class ListInterviewsView(InterviewsView):
    template_name = 'interviews-list.html'


class CalendarInterviewsView(InterviewsView):
    template_name = 'interviews-calendar.html'


class UpdateCreateInterviewView(object):
    template_name = 'interviews-create.html'
    success_url = reverse_lazy('interviews')
    form_class = CreateInterviewForm

    def form_valid(self, form):
        form.instance.interview_status = Interview.OPEN
        form.instance.interview_owner = self.request.user
        return super(UpdateCreateInterviewView, self).form_valid(form)

    def get_form_kwargs(self):
        kwargs = super(UpdateCreateInterviewView, self).get_form_kwargs()
        kwargs['user'] = self.request.user
        return kwargs


class CreateInterviewView(LoginRequired, UpdateCreateInterviewView, CreateView):
    pass


class UpdateInterviewView(LoginRequired, UpdateCreateInterviewView, UpdateView):
    def get_queryset(self):
        return Interview.objects.filter(pk=self.kwargs['pk'])


class DeleteInterviewView(LoginRequired, View):
    def delete(self, request, *args, **kwargs):
        pk = self.kwargs['pk']
        response_data = {}
        interview = get_object_or_404(Interview, pk=pk)
        interview.delete()
        response_data['message'] = "Interview " + pk + "deleted"
        return HttpResponse(json.dumps(response_data), content_type="application/json")

