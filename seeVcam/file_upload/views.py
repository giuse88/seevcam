import logging
import json
from django.http import HttpResponseBadRequest, HttpResponse
from django import views

log = logging.getLogger(__name__)


class FileUpload(views.View):

    UNSUPPORTED_REQUEST = 'Unsupported request'
    upload_directory = '/'

    def post(self):

        log.info('[File upload] : Received request')

        if not self.request.FILES:
            log.error('[File upload] : request without file')
            return HttpResponseBadRequest('Must have files attached!')

        response_data = {'files': {}}

        return HttpResponse(json.dumps(response_data), content_type="application/json")

    def delete(self):
        pass

    def get(self):
        return HttpResponseBadRequest(FileUpload.UNSUPPORTED_REQUEST)

    def put(self):
        return HttpResponseBadRequest(FileUpload.UNSUPPORTED_REQUEST)

    def patch(self):
        return HttpResponseBadRequest(FileUpload.UNSUPPORTED_REQUEST)

