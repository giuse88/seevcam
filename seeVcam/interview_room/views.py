import datetime

from django.conf import settings
from django.views.generic import DetailView, TemplateView
from opentok import OpenTok, Roles

from common.helpers.timezone import now_timezone
from common.mixins.authorization import LoginRequired, IsOwnerOr404, TokenVerification
from interviews.models import Interview

# ================================== TO BE DELETED ==============================


# for development purposes
class InterviewRoomViewExperiment(LoginRequired, TemplateView):
    template_name = "index.html"
    test = False

    def get_context_data(self, **kwargs):
        InterviewRoomViewExperiment.test = not InterviewRoomViewExperiment.test
        context = super(InterviewRoomViewExperiment, self).get_context_data(**kwargs)
        opentok = OpenTok(settings.OPENTOK_API_KEY, settings.OPENTOK_SECRET)
        context['test'] = self.test
        context['is_interview_open'] = True
        context['api_key'] = settings.OPENTOK_API_KEY
        context['session_id'] = "1_MX40NTExOTk3Mn5-MTQyMDI3NzYxMzI1NH5zek80L1owVkRadGVRMS9peUZQR2dKa0l-UH4"
        context['role'] = "interviewer"
        context['token'] = opentok.generate_token(session_id=context['session_id'],
                                                  data="test=" + str(InterviewRoomViewExperiment.test),
                                                  role=Roles.publisher)
        return context


class InterviewRoomViewExperimentEE(LoginRequired, TemplateView):
    template_name = "index.html"
    test = False

    def get_context_data(self, **kwargs):
        InterviewRoomViewExperiment.test = not InterviewRoomViewExperiment.test
        context = super(InterviewRoomViewExperimentEE, self).get_context_data(**kwargs)
        opentok = OpenTok(settings.OPENTOK_API_KEY, settings.OPENTOK_SECRET)
        context['test'] = self.test
        context['is_interview_open'] = True
        context['api_key'] = settings.OPENTOK_API_KEY
        context['session_id'] = "1_MX40NTExOTk3Mn5-MTQyMDI3NzYxMzI1NH5zek80L1owVkRadGVRMS9peUZQR2dKa0l-UH4"
        context['role'] = "interviewee"
        context['token'] = opentok.generate_token(session_id=context['session_id'],
                                                  data="test=" + str(InterviewRoomViewExperiment.test),
                                                  role=Roles.publisher)
        return context

# ======================= END TO BE DELETED ========================


class InterviewRoomView(DetailView):
    template_name = "index.html"
    interview = None

    def get_role(self):
        return "interviewer"

    def get_object(self, queryset=None):
        if self.interview is None:
            self.interview = Interview.objects.get(pk=self.kwargs['interview_id'])
        return self.interview

    def get_context_data(self, **kwargs):
        context = super(InterviewRoomView, self).get_context_data(**kwargs)
        interview = self.get_object()
        context['api_key'] = settings.OPENTOK_API_KEY
        context['session_id'] = interview.session_id
        context['role'] = self.get_role()
        context['is_interview_open'] = self.is_interview_open()
        context['token'] = self.generate_opentok_token(interview.session_id)
        context['interview'] = interview
        context['catalogue'] = interview.catalogue
        context['job_position'] = interview.job_position
        return context

    def is_interview_open(self):
        interview = self.get_object()
        real_open_time = interview.start - datetime.timedelta(minutes=settings.INTERVIEW_OPEN)
        real_close_time = interview.end + datetime.timedelta(minutes=settings.INTERVIEW_CLOSE)
        opened = now_timezone() >= real_open_time
        closed = now_timezone() <= real_close_time and interview.status is not Interview.CLOSED
        return opened and closed

    def generate_opentok_token(self, session_id):
        opentok = OpenTok(settings.OPENTOK_API_KEY, settings.OPENTOK_SECRET)
        return opentok.generate_token(session_id=session_id,
                                      data="role=" + self.get_role(),
                                      role=Roles.publisher)


class IntervieweeView(TokenVerification, InterviewRoomView):
    def get_role(self):
        return "interviewee"


class InterviewerView(LoginRequired, IsOwnerOr404, InterviewRoomView):

    def get_role(self):
        return "interviewer"
