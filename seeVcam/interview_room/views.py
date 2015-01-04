from datetime import datetime
from django.conf import settings
from django.views.generic import DetailView, TemplateView
from opentok import OpenTok, Roles
import opentok
from common.mixins.authorization import LoginRequired, IsOwnerOr404, TokenVerification
from interviews.models import Interview


# for development purposes
class InterviewRoomViewExperiment(TemplateView):

    template_name = "interview-room.html"
    test = False

    def get_context_data(self, **kwargs):
        InterviewRoomView.test = not InterviewRoomView.test
        context = super(InterviewRoomView, self).get_context_data(**kwargs)
        # this should be a singleton
        opentok = OpenTok(settings.OPENTOK_API_KEY, settings.OPENTOK_SECRET)
        # session = opentok.create_session()
        # context['session_id'] = session.session_id
        context['test'] = self.test
        context['api_key'] = settings.OPENTOK_API_KEY
        context['session_id'] = "1_MX40NTExOTk3Mn5-MTQyMDI3NzYxMzI1NH5zek80L1owVkRadGVRMS9peUZQR2dKa0l-UH4"
        context['token'] = opentok.generate_token(session_id=context['session_id'],
                                                  data="test=" + str(InterviewRoomView.test),
                                                  role=Roles.publisher)
        print(self.test)
        print(context['token'])
        return context

    # this should be valid only for the interviewer
    # @method_decorator(login_required)
    # def dispatch(self, *args, **kwargs):
    #     return super(InterviewRoomView, self).dispatch(*args, **kwargs)

class InterviewRoomView(DetailView):
    template_name = "interview-room.html"
    interview = None

    def get_role(self):
        return "unknown"

    @staticmethod
    def is_interview_open(interview):
        # this has to happen with UTC timezones
        real_open_time = interview.start + settings.INTERVIEW_OPEN
        real_close_time = interview.end + settings.INTERVIEW_CLOSE
        opened = datetime.now() >= real_open_time
        closed = datetime.now() <= real_close_time and interview.status is not Interview.CLOSED
        return opened and closed

    def get_object(self, queryset=None):
        if self.interview is None:
            self.interview = Interview.objects.get(pk=self.kwargs['interview_id'])
        return self.interview

    def get_context_data(self, **kwargs):
        context = super(InterviewRoomView, self).get_context_data(**kwargs)
        interview = self.get_object()
        context['api_key'] = settings.OPENTOK_API_KEY
        context['session_id'] = interview.session_id
        context['token'] = opentok.generate_token(session_id=context['session_id'],
                                                  data="role="+self.get_role(),
                                                  role=Roles.publisher)
        return context

    def get(self, request, *args, **kwargs):
        interview = self.get_object()

        if not self.is_interview_open(interview):
            # redirect to interview close template
            pass

        return super(InterviewRoomView, self).get(request, *args, **kwargs)


class IntervieweeView(InterviewRoomView, TokenVerification):
    def get_role(self):
        return "interviewer"


class InterviewerView(LoginRequired, IsOwnerOr404, InterviewRoomView):
    def get_role(self):
        return "interviewee"


