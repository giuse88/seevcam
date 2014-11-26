import os

from django.conf import settings
from django.test import TestCase

from common.helpers.test_helper import create_upload_file, create_dummy_user
from rest_framework.renderers import JSONRenderer
from file_upload.models import UploadedFile
from file_upload.serializers import UploadedFileSerializer


class UploadFileModelTest(TestCase):

    def setUp(self):
        self.file = create_upload_file()
        self.user = create_dummy_user('test@test.com', 'test')
        self.uploaded_file = UploadedFile.objects.create_uploaded_file(self.file, self.user)
        self.uploaded_file.save()

    def tearDown(self):
        if self.uploaded_file:
            self.uploaded_file.delete()
        os.remove(os.path.join(settings.SEEVCAM_UPLOAD_FILE_FOLDER, str(self.user.id), self.file.name))
        os.rmdir(os.path.join(settings.SEEVCAM_UPLOAD_FILE_FOLDER, str(self.user.id)))

    def test_creation_file_upload(self):
        uploaded_file_db = UploadedFile.objects.get(pk=1)
        self.assertEqual(uploaded_file_db.name, "test.pdf")
        self.assertEqual(uploaded_file_db.size, self.file.size)
        self.assertEqual(uploaded_file_db.created_by.id, self.user.id)

    def test_delete_file_upload(self):
        self.uploaded_file.delete()
        self.assertEqual(UploadedFile.objects.filter(pk=1).count(), 0)
        self.uploaded_file = None

    def test_serializer(self):
        file_json = '{"id": 1, "type": "", "size": 35, "url": "url", "delete_type": "DELETE", "delete_url": "delete_url", "name": "test.pdf"}'
        file = UploadedFile.objects.get(pk=1)
        serializer = UploadedFileSerializer(file)
        json = JSONRenderer().render(serializer.data)
        self.assertJSONEqual(file_json, json)
