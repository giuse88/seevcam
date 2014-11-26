import logging
import json
from django.http import HttpResponseBadRequest, HttpResponse
from django import views
from file_upload.models import UploadedFile

log = logging.getLogger(__name__)



class FileUpload(views.View):

    UNSUPPORTED_REQUEST = 'Unsupported request'
    upload_directory = '/'

    upload_url = '/media/'
    delete_url = '/files/'

    def post(self):

        log.info('[File upload] : Received request')
        if not self.request.FILES:
            log.error('[File upload] : request without file')
            return HttpResponseBadRequest('Must have files attached!')

        file = self.request.FILES['cv']
        uploaded_file = UploadedFile(file=file, size=file.size, created_by=self.request.user, name=file.name)

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

