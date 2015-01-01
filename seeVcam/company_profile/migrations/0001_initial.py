# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Company',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('name', models.CharField(db_index=True, max_length=255)),
            ],
            options={
                'verbose_name': 'company',
                'db_table': 'companies',
                'verbose_name_plural': 'companies',
            },
            bases=(models.Model,),
        ),
    ]
