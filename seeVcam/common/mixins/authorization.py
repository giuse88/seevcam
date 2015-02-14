from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.utils.decorators import method_decorator


class LoginRequired(object):

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(LoginRequired, self).dispatch(*args, **kwargs)


class IsOwnerOr404(object):

    def get_object(self, *args, **kwargs):
        obj = super(IsOwnerOr404, self).get_object(*args, **kwargs)
        if not obj.owner == self.request.user:
            raise Http404
        return obj


class TokenVerification(object):

    def get_object(self, *args, **kwargs):
        url_token = self.kwargs['token']
        obj = super(TokenVerification, self).get_object(*args, **kwargs)
        if not obj.token == url_token:
            raise Http404
        return obj
