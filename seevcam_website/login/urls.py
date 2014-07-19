from django.conf.urls import patterns, url
from views import LoginView

urlpatterns = patterns('',
                       url(r'^$', LoginView.as_view(), name='login'),
)
