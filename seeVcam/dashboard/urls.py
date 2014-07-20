from django.conf.urls import patterns, include, url
from django.conf import settings
from django.contrib.auth.decorators import login_required

from views import DashboardView


urlpatterns = patterns('',
                       url(r'^logout/', login_required('django.contrib.auth.views.logout'),
                           {'next_page': settings.LOGIN_URL},
                           name="logout"),
                       url(r'^interviews/', include('interviews.urls')),
                       url(r'^questions/', include('questions.urls')),
                       url(r'^$', DashboardView.as_view(), name='dashboard'),
)
