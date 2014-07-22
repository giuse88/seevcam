from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import logout_then_login
from views import DashboardView


urlpatterns = patterns('',
                       url(r'^logout/', login_required(logout_then_login), name="logout"),
                       url(r'^interviews/', include('interviews.urls')),
                       url(r'^questions/', include('questions.urls')),
                       url(r'^$', DashboardView.as_view(), name='dashboard'),
)
