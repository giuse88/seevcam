# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0004_interview_overall_score'),
    ]

    operations = [
        migrations.AlterField(
            model_name='interview',
            name='overall_score',
            field=models.FloatField(null=True, blank=True),
            preserve_default=True,
        ),
    ]
