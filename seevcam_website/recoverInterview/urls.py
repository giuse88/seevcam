from django.conf.urls import patterns, url
from views import RecoverLinkView

urlpatterns = patterns('',
                       url(r'^$', RecoverLinkView.as_view(), name='recoverInterview'),
)
