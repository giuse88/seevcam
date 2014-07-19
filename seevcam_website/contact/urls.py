from django.conf.urls import patterns, url
from views import ContactView

urlpatterns = patterns('',
                       url(r'^$', ContactView.as_view(), name='contact'),
)
