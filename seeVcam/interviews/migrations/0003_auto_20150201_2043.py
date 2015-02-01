# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0002_interview_session_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='interview',
            name='duration',
        ),
        migrations.AddField(
            model_name='interview',
            name='token',
            field=models.CharField(default='UNKNOWN', max_length=255),
            preserve_default=True,
        ),
    ]
