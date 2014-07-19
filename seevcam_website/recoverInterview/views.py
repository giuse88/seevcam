from django.views.generic import TemplateView


class RecoverLinkView(TemplateView):
    template_name = "recoverlink.html"