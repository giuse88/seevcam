from django.conf.urls import patterns, include, url
from authentication.views import protected_logout
from views import DashboardView


urlpatterns = patterns('',
                       url(r'^logout/', protected_logout, name="logout"),
                       url(r'^interviews/', include('interviews.urls')),
                       url(r'^questions/', include('questions.urls')),
                       url(r'^$', DashboardView.as_view(), name='dashboard'),
)
