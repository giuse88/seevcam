# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import yaml

document = """
Catalog_1:
 - question_1.1
 - question_1.2
 - question_1.3
Catalog_2:
 - question_2.1
 - question_2.2
 - question_2.3
Catalog_3:
 - question_3.1
 - question_3.2
 - question_3.3
"""


def populate_catalogs(apps, schema_editor):
    Catalog = apps.get_model("questions", "QuestionCatalogue")
    Question = apps.get_model("questions", "Question")
    User = apps.get_model("authentication", "SeevcamUser")
    db_alias = schema_editor.connection.alias
    seevcam = User.objects.get(email="admin@admin.com")
    catalogs_to_load = yaml.load(document)
    print()
    print(type(catalogs_to_load))
    print(catalogs_to_load)
    for k, v in catalogs_to_load.items():
        cat = Catalog.objects.using(db_alias).create(
            catalogue_scope="SEEVCAM", catalogue_name=k, catalogue_owner=seevcam
        )
        for q in v:
            Question.objects.using(db_alias).create(question_text=q, question_catalogue=cat)


class Migration(migrations.Migration):
    dependencies = [
        ('questions', '0001_initial'),
        ('authentication', '0002_initial_data'),
    ]

    operations = [
        migrations.RunPython(populate_catalogs),
    ]
