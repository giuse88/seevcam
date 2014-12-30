# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def populate_catalogs(apps, schema_editor): pass
    # Catalog = apps.get_model("questions", "QuestionCatalogue")
    # User = apps.get_model("authentication", "SeevcamUser")
    # db_alias = schema_editor.connection.alias
    # seevcam = User.objects.get(id=1)
    # print(seevcam)
    # Catalog.objects.using(db_alias).bulk_create([
    #     Catalog(catalogue_scope="SEEVCAM", catalogue_name="LOAD_1", catalogue_owner=seevcam),
    #     Catalog(catalogue_scope="SEEVCAM", catalogue_name="LOAD_2", catalogue_owner=seevcam),
    #     Catalog(catalogue_scope="SEEVCAM", catalogue_name="LOAD_3", catalogue_owner=seevcam)
    # ])


class Migration(migrations.Migration):
    dependencies = [
        ('questions', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_catalogs),
    ]
