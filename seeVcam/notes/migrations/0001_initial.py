# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('interviews', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notes',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('text_content', models.TextField(blank=True, default='')),
                ('interview', models.ForeignKey(null=True, blank=True, to='interviews.Interview')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
