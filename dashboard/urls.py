from django.conf.urls import patterns, include, url
from django.contrib.auth.decorators import login_required
from django.contrib.auth.views import logout_then_login
from views import DashboardView

urlpatterns = patterns('',
                       url(r'^$', DashboardView.as_view(), name='dashboard'),
                       url(r'^logout/', login_required(logout_then_login), name="logout"),
                       url(r'^interviews/', include('interviews.urls')),
                       url(r'^help', DashboardView.as_view()),
                       url(r'^questions/', include('questions.urls')),
                       url(r'^reports/', include('reports.urls')),
                       url(r'^files/', include('file_upload.urls')),
                       url(r'^profile/', include('userprofile.urls')),
)
