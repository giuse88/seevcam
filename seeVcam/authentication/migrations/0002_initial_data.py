# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import django.contrib.auth.hashers as hasher


def populate_superuser(apps, schema_editor):
    SeevcamUser = apps.get_model("authentication", "SeevcamUser")
    Company = apps.get_model("company_profile", "Company")
    Notifications = apps.get_model("userprofile", "UserNotifications")
    db_alias = schema_editor.connection.alias
    seevcam_company = Company.objects.get(id=1)
    SeevcamUser.objects.using(db_alias).create(is_staff=True, is_superuser=True,
                                               password=hasher.make_password(password="admin"),
                                               email="admin@admin.com",
                                               first_name="Admin",
                                               last_name="Istrator",
                                               country='GB',
                                               timezone='Europe/London',
                                               company=seevcam_company,
                                               notifications=Notifications.objects.get(id=1))

    SeevcamUser.objects.using(db_alias).create(is_staff=True,
                                               password=hasher.make_password(password="seevcam"),
                                               email="seevcam@gmail.com",
                                               first_name="Seev",
                                               last_name="Cam",
                                               country='GB',
                                               timezone='Europe/London',
                                               company=seevcam_company,
                                               notifications=Notifications.objects.get(id=2))


class Migration(migrations.Migration):
    dependencies = [
        ('authentication', '0001_initial'),
        ('company_profile', '0002_initial_data'),
        ('userprofile', '0002_initial_data'),
    ]

    operations = [
        migrations.RunPython(populate_superuser),
    ]
