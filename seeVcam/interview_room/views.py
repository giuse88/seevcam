from django.conf import settings
from django.views.generic import TemplateView
from opentok import OpenTok, Roles


class InterviewRoomView(TemplateView):
    template_name = "interview-room.html"

    # this should be valid only for the interviewer
    # @method_decorator(login_required)
    # def dispatch(self, *args, **kwargs):
    #     return super(InterviewRoomView, self).dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super(InterviewRoomView, self).get_context_data(**kwargs)
        # this should be a singleton
        opentok = OpenTok(settings.OPENTOK_API_KEY, settings.OPENTOK_SECRET)
        # session = opentok.create_session()
        # context['session_id'] = session.session_id
        context['api_key'] = settings.OPENTOK_API_KEY
        context['session_id'] = "1_MX40NTExOTk3Mn5-MTQyMDI3NzYxMzI1NH5zek80L1owVkRadGVRMS9peUZQR2dKa0l-UH4"
        context['token'] = opentok.generate_token(session_id=context['session_id'], role=Roles.publisher)
        return context
