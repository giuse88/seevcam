# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import file_upload.models
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UploadedFile',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('file', models.FileField(upload_to=file_upload.models.upload_to_user_folder)),
                ('type', models.CharField(max_length=250)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(max_length=250)),
                ('original_name', models.CharField(max_length=250)),
                ('size', models.PositiveIntegerField()),
                ('url', models.URLField(unique=True)),
                ('delete_url', models.URLField(unique=True)),
                ('delete_type', models.CharField(max_length=50, default='DELETE')),
                ('upload_type', models.CharField(max_length=50, default='POST')),
                ('created_by', models.ForeignKey(db_column='created_by', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'uploaded_files',
            },
            bases=(models.Model,),
        ),
    ]
