# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def populate_catalogs(apps, schema_editor):
    Catalog = apps.get_model("questions", "QuestionCatalogue")
    User = apps.get_model("authentication", "SeevcamUser")
    db_alias = schema_editor.connection.alias
    seevcam = User.objects.get(email="admin@admin.com")
    Catalog.objects.using(db_alias).bulk_create([
        Catalog(catalogue_scope="SEEVCAM", catalogue_name="Catalog_1", catalogue_owner=seevcam),
        Catalog(catalogue_scope="SEEVCAM", catalogue_name="Catalog_2", catalogue_owner=seevcam),
        Catalog(catalogue_scope="SEEVCAM", catalogue_name="Catalog_3", catalogue_owner=seevcam)
    ])


def populate_questions(apps, schema_editor):
    Catalog = apps.get_model("questions", "QuestionCatalogue")
    Question = apps.get_model("questions", "Question")
    User = apps.get_model("authentication", "SeevcamUser")
    db_alias = schema_editor.connection.alias
    seevcam = User.objects.get(email="admin@admin.com")
    seevcam_catalogs = Catalog.objects.filter(catalogue_owner=seevcam)
    for i, catalog in enumerate(seevcam_catalogs):
        for j in range(1, 4):
            text = "question_" + str(i + 1) + "." + str(j)
            Question.objects.using(db_alias).create(question_text=text, question_catalogue=catalog)


class Migration(migrations.Migration):
    dependencies = [
        ('questions', '0001_initial'),
        ('authentication', '0002_initial_data'),
    ]

    operations = [
        migrations.RunPython(populate_catalogs),
        migrations.RunPython(populate_questions),
    ]
