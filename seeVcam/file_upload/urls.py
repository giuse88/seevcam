from django.conf.urls import patterns, url
from django.views.generic import TemplateView

from file_upload.views import file_upload, file_delete


urlpatterns = patterns('',
                       url(r'^test/', TemplateView.as_view(template_name="index.html")),
                       url(r'^', file_upload, name="file_upload"),
                       url(r'(?P<pk>[0-9]+)?$', file_delete, name='file_delete')
)
