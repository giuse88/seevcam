# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import yaml
import os.path
from django.conf import settings

BASE = os.path.dirname(os.path.abspath(__file__))


def populate_catalogs(apps, schema_editor):
    if settings.ENVIRONMENT == "TEST":
        return
    Catalog = apps.get_model("questions", "QuestionCatalogue")
    Question = apps.get_model("questions", "Question")
    User = apps.get_model("authentication", "SeevcamUser")
    db_alias = schema_editor.connection.alias
    seevcam = User.objects.get(email="admin@admin.com")
    document = open(os.path.join(BASE, '../fixtures/catalogs.yml'), 'r')
    catalogs_to_load = yaml.load(document)

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
