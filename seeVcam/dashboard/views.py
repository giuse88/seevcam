from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView
from django.conf import settings


class DashboardView(TemplateView):
    template_name = "dashboard.html"

    def get_context_data(self, **kwargs):
        context = super(DashboardView, self).get_context_data(**kwargs)
        context['environment'] = settings.ENVIRONMENT
        return context

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(DashboardView, self).dispatch(*args, **kwargs)