# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import overall_ratings.models


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='OverallRating',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('rating', models.PositiveSmallIntegerField(blank=True, validators=[overall_ratings.models.validate_rating], null=True, db_column='rating')),
                ('interview', models.ForeignKey(to='interviews.Interview', db_column='interview_id')),
            ],
            options={
                'verbose_name': 'overall_ratings',
                'verbose_name_plural': 'overall_ratings',
                'db_table': 'overall_rating',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='OverallRatingQuestion',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, verbose_name='ID', primary_key=True)),
                ('question', models.TextField(db_column='overall_rating_question')),
            ],
            options={
                'verbose_name': 'overall_rating_question',
                'verbose_name_plural': 'overall_rating_questions',
                'db_table': 'overall_rating_questions',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='overallrating',
            name='question',
            field=models.ForeignKey(to='overall_ratings.OverallRatingQuestion', db_column='question_id'),
            preserve_default=True,
        ),
    ]
