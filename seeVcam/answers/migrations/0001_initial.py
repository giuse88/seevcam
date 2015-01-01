# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import answers.models


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0001_initial'),
        ('questions', '0002_initial_data'),
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('content', models.TextField(blank=True, null=True, db_column='content')),
                ('rating', models.PositiveSmallIntegerField(blank=True, db_column='rating', validators=[answers.models.validate_rating], null=True)),
                ('interview', models.ForeignKey(to='interviews.Interview', db_column='interview_id')),
                ('question', models.ForeignKey(to='questions.Question', db_column='question_id')),
            ],
            options={
                'db_table': 'answers',
                'verbose_name': 'answer',
                'verbose_name_plural': 'answers',
            },
            bases=(models.Model,),
        ),
    ]
