# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='interview',
            name='session_id',
            field=models.CharField(max_length=255, default='UNKNOWN'),
            preserve_default=True,
        ),
    ]
