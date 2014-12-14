from django.conf.urls import patterns, url
from django.views.generic import TemplateView
from file_upload.views import file_upload, file_handler

urlpatterns = patterns('',
                       url(r'^test/', TemplateView.as_view(template_name="index.html")),
                       url(r'^$', file_upload, name="file_upload"),
                       url(r'(?P<pk>[0-9]+)?$', file_handler, name='file_detail'),
                       url(r'(?P<pk>[0-9]+)?$', file_handler, name='file_delete'),
)
