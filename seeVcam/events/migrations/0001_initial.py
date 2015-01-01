# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='ID', auto_created=True)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('timestamp', models.DateTimeField(db_column='timestamp')),
                ('content', models.TextField(default='{}', db_column='content')),
                ('type', models.CharField(db_column='type', choices=[('RATE_CREATED', 'RATE_CREATED'), ('RATE_UPDATED', 'RATE_UPDATED'), ('ANSWER_UPDATED', 'ANSWER_UPDATED'), ('ANSWER_CREATE', 'ANSWER_CREATE'), ('QUESTION_SELECTED', 'QUESTION_SELECTED')], max_length=255)),
                ('interview', models.ForeignKey(db_column='interview_id', to='interviews.Interview')),
            ],
            options={
                'verbose_name': 'event',
                'db_table': 'events',
                'verbose_name_plural': 'events',
            },
            bases=(models.Model,),
        ),
    ]
