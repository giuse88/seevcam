# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def populate_company(apps, schema_editor):
    Company = apps.get_model("company_profile", "Company")
    db_alias = schema_editor.connection.alias
    Company.objects.using(db_alias).create(name="seevcam")


class Migration(migrations.Migration):
    dependencies = [
        ('company_profile', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_company),
    ]
