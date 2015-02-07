# -*- coding: utf-8 -*-
import os
from django.db import migrations
import yaml

BASE = os.path.dirname(os.path.abspath(__file__))


def populate_overall_ratings(apps, schema_editor):
    OverallRatingQuestion = apps.get_model("overall_ratings", "OverallRatingQuestion")
    db_alias = schema_editor.connection.alias
    document = open(os.path.join(BASE, '../fixtures/overall_ratings.yml'), 'r')
    items = yaml.load(document)
    print(items)
    questions = items

    for question in questions:
        OverallRatingQuestion \
            .objects.using(db_alias) \
            .create(question=question)


class Migration(migrations.Migration):
    dependencies = [
        ('overall_ratings', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(populate_overall_ratings),
    ]
