from django.http import Http404
from django.views.generic import View


class AJAXPost(View):

    def get(self, request, *args, **kwargs):
        raise Http404

    def post(self, request, *args, **kwargs):
        if not self.request.is_ajax():
            raise Http404
        return super(AJAXPost, self).post(request, *args, **kwargs)
