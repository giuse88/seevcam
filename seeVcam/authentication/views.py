# NOT TO BE USED IN PRODUCTION

from django.contrib.auth.views import login
from django.shortcuts import redirect
from django.conf import settings


def login_or_redirect(request, **kwargs):
    if request.user.is_authenticated():
        return redirect(settings.LOGIN_REDIRECT_URL)
    else:
        return login(request, **kwargs)


