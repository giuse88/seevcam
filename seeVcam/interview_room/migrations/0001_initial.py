# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='InterviewEvents',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
            ],
            options={
                'db_table': 'interview_events',
                'verbose_name': 'interview_event',
                'verbose_name_plural': 'interview_events',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='InterviewRatings',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
            ],
            options={
                'db_table': 'interview_ratings',
                'verbose_name': 'interview_ratings',
                'verbose_name_plural': 'interview_ratings',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='InterviewVideo',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
            ],
            options={
                'db_table': 'interview_videos',
                'verbose_name': 'interview_video',
                'verbose_name_plural': 'interview_videos',
            },
            bases=(models.Model,),
        ),
    ]
