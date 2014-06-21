from django.shortcuts import render, render_to_response
from django.contrib.auth import authenticate, login, logout
from django.template import RequestContext
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
# Create your views here.


@login_required
def welcome(request):
    template = 'login/welcome.html'
    context = {"message": "YO, you are authenticated"}
    return render(request, template, context)


def home(request):
    template = 'login/home.html'
    context = {}
    return render(request, template, context)


def user_login(request):
    # Obtain the context for the user's request.
    context = RequestContext(request)

    # If the request is a HTTP POST, try to pull out the relevant information.
    if request.method == 'POST':
        # This information is obtained from the login form.
        username = request.POST['username']
        password = request.POST['password']

        # To see if the username/password combination is valid
        user = authenticate(username=username, password=password)

        # If we have a User object, the details are correct.
        if user is not None:
            # Is the account active? It could have been disabled.
            if user.is_active:
                # If the account is valid and active, we can log the user in.
                # Send the user back to the homepage.
                login(request, user)

                return HttpResponseRedirect(reverse('welcome'))
            else:
                # An inactive account was used - no logging in!
                return HttpResponse("Your account is disabled.")
        else:
            # Bad login details were provided. So we can't log the user in.
            print "Invalid login details: {0}, {1}".format(username, password)
            return HttpResponse("Invalid login details supplied.")
    # The request is not a HTTP POST, so display the login form.
    else:
        # No context variables to pass to the template system
        return render_to_response('login/login.html', {}, context)


@login_required
def user_logout(request):
    # just log  out.
    logout(request)

    # Take the user back to the homepage.
    return HttpResponseRedirect('/login/')
