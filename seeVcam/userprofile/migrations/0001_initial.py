# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserApplications',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
            ],
            options={
                'verbose_name': 'user_applications',
                'db_table': 'user_applications',
                'verbose_name_plural': 'user_applications',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='UserNotifications',
            fields=[
                ('id', models.AutoField(serialize=False, auto_created=True, primary_key=True, verbose_name='ID')),
                ('notification_when_room_is_open', models.BooleanField(default=True)),
                ('notification_day_before', models.BooleanField(default=False)),
                ('notification_hour_before', models.BooleanField(default=False)),
            ],
            options={
                'verbose_name': 'user_notifications',
                'db_table': 'user_notifications',
                'verbose_name_plural': 'user_notifications',
            },
            bases=(models.Model,),
        ),
    ]
