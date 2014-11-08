from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView


class InterviewRoomView(TemplateView):
    template_name = "interview-room.html"

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(InterviewRoomView, self).dispatch(*args, **kwargs)