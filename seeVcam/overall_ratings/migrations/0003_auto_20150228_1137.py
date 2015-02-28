# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import overall_ratings.models


class Migration(migrations.Migration):

    dependencies = [
        ('overall_ratings', '0002_auto_20150131_1212'),
    ]

    operations = [
        migrations.AlterField(
            model_name='overallrating',
            name='rating',
            field=models.PositiveSmallIntegerField(blank=True, db_column='rating', null=True, validators=[overall_ratings.models.validate_rating], default=0),
            preserve_default=True,
        ),
    ]
