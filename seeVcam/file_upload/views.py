import logging
import json
import os
from django.http import HttpResponseBadRequest, HttpResponse
from file_upload.models import UploadedFile
from file_upload.serializers import UploadedFileSerializer

log = logging.getLogger(__name__)

UNSUPPORTED_REQUEST = 'Unsupported request'


def file_upload(request):
    if request.method == 'POST':
        log.info('[File upload] : Received request')
        if not request.FILES:
            log.error('[File upload] : request without file')
            return HttpResponseBadRequest('Must have files attached!')

        file_request = request.FILES[u'files[]']
        file_type = request.POST['type']
        uploaded_file = UploadedFile.objects.create_uploaded_file(file_request, request.user, file_type)
        serializer = UploadedFileSerializer(uploaded_file)
        response_data = {'files': [serializer.data]}
        return HttpResponse(json.dumps(response_data), content_type="application/json")
    else:
        return HttpResponseBadRequest(UNSUPPORTED_REQUEST)


def file_delete(request):
    pk = request.kwargs['pk']
    uploaded_file = UploadedFile.objects.get(pk=pk)
    #this should be async
    os.remove(uploaded_file.file)
    uploaded_file.delete()
