# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interview_room', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='InterviewEvents',
        ),
        migrations.DeleteModel(
            name='InterviewRatings',
        ),
        migrations.DeleteModel(
            name='InterviewVideo',
        ),
    ]
