from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView


class DashboardView(TemplateView):
    template_name = "dashboard.html"