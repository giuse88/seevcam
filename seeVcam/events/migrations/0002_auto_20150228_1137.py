# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='type',
            field=models.CharField(db_column='type', choices=[('RATE_CREATED', 'RATE_CREATED'), ('RATE_UPDATED', 'RATE_UPDATED'), ('ANSWER_UPDATED', 'ANSWER_UPDATED'), ('ANSWER_CREATED', 'ANSWER_CREATED'), ('QUESTION_SELECTED', 'QUESTION_SELECTED')], max_length=255),
            preserve_default=True,
        ),
    ]
