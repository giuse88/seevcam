from django.shortcuts import render, render_to_response
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
# Create your views here.

from allauth.account.decorators import verified_email_required


@login_required
def welcome(request):
    template = 'login/profile.html'
    context = {"message": "YO, you are authenticated"}
    return render(request, template, context)


def home(request):
    template = 'home.html'
    context = {}
    return render(request, template, context)


@verified_email_required
def verified_users_only_view(request):
    template = 'login/verified_email.html'
    context = {}
    return render(request, template, context)
