# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import file_upload_service.models


class Migration(migrations.Migration):

    dependencies = [
        ('file_upload_service', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploadedfile',
            name='file',
            field=models.FileField(max_length=2000, upload_to=file_upload_service.models.upload_to_user_folder),
            preserve_default=True,
        ),
    ]
