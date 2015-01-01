# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('question_text', models.TextField()),
            ],
            options={
                'db_table': 'questions',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='QuestionCatalogue',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('catalogue_scope', models.CharField(default='PRIVATE', max_length=255, choices=[('PRIVATE', 'private'), ('SEEVCAM', 'seevcam'), ('ANONYMOUS', 'anonymous')])),
                ('catalogue_name', models.CharField(max_length=255)),
                ('catalogue_owner', models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'db_table': 'catalogues',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='question',
            name='question_catalogue',
            field=models.ForeignKey(to='questions.QuestionCatalogue'),
            preserve_default=True,
        ),
    ]
