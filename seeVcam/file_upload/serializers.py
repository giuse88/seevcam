from rest_framework import serializers
from file_upload.models import UploadedFile


class UploadedFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedFile
        fields = ('id', 'type', 'size', 'url', 'delete_type', 'delete_url', 'name')
