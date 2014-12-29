from rest_framework import serializers
from .models import UploadedFile


class UploadedFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UploadedFile
        fields = ('id', 'type', 'size', 'url', 'delete_type', 'delete_url', 'name', 'original_name')
        read_only_fields = fields
