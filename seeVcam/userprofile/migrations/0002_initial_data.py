# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def populate_profiles(apps, schema_editor):
    UserNotifications = apps.get_model("userprofile", "UserNotifications")
    db_alias = schema_editor.connection.alias
    UserNotifications.objects.using(db_alias).bulk_create([
        UserNotifications(notification_when_room_is_open=1, notification_day_before=0, notification_hour_before=0),
        UserNotifications(notification_when_room_is_open=1, notification_day_before=0, notification_hour_before=0)
    ])


class Migration(migrations.Migration):
    dependencies = [
        ('userprofile', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_profiles),
    ]
