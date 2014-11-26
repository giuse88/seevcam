from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import logout_then_login
from views import DashboardView

urlpatterns = patterns('',
                       url(r'^upload/', login_required(logout_then_login), name="logout"),
)
