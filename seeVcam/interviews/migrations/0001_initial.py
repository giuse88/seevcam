# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('file_upload', '0001_initial'),
        ('company_profile', '0001_initial'),
        ('questions', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255, db_index=True)),
                ('surname', models.CharField(max_length=255, db_index=True)),
                ('email', models.EmailField(max_length=75, db_index=True)),
                ('company', models.ForeignKey(to='company_profile.Company')),
                ('created_by', models.ForeignKey(to=settings.AUTH_USER_MODEL, db_column='created_by')),
                ('cv', models.OneToOneField(to='file_upload.UploadedFile')),
            ],
            options={
                'verbose_name': 'candidate',
                'db_table': 'candidates',
                'verbose_name_plural': 'candidates',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Interview',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('status', models.CharField(max_length=255, default='OPEN', choices=[('ONGOING', 'ongoing'), ('CLOSED', 'closed'), ('OPEN', 'open'), ('EXPIRED', 'expired')])),
                ('start', models.DateTimeField()),
                ('end', models.DateTimeField()),
                ('duration', models.PositiveIntegerField(default=30, choices=[(15, '15 m'), (30, '30 m'), (60, '1 h'), (120, '2 h')])),
                ('candidate', models.ForeignKey(to='interviews.Candidate')),
                ('catalogue', models.ForeignKey(to='questions.QuestionCatalogue', blank=True, null=True)),
            ],
            options={
                'verbose_name': 'interview',
                'db_table': 'interviews',
                'verbose_name_plural': 'interviews',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='JobPosition',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('added_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('position', models.CharField(max_length=255)),
                ('company', models.ForeignKey(to='company_profile.Company')),
                ('created_by', models.ForeignKey(to=settings.AUTH_USER_MODEL, db_column='created_by')),
                ('job_description', models.OneToOneField(to='file_upload.UploadedFile')),
            ],
            options={
                'verbose_name': 'job_position',
                'db_table': 'job_positions',
                'verbose_name_plural': 'job_positions',
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='interview',
            name='job_position',
            field=models.ForeignKey(to='interviews.JobPosition'),
            preserve_default=True,
        ),
        migrations.AddField(
            model_name='interview',
            name='owner',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL),
            preserve_default=True,
        ),
    ]
