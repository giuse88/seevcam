# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0003_auto_20150201_2043'),
    ]

    operations = [
        migrations.AddField(
            model_name='interview',
            name='overall_score',
            field=models.FloatField(null=True),
            preserve_default=True,
        ),
    ]
