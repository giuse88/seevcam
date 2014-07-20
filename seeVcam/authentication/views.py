# NOT TO BE USED IN PRODUCTION
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import login
from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth.views import logout_then_login


def login_or_redirect(request, **kwargs):
    if request.user.is_authenticated():
        return redirect(settings.LOGIN_REDIRECT_URL)
    else:
        return login(request, **kwargs)


@login_required
def protected_logout(request, **kwargs):
    return logout_then_login(request, **kwargs)
