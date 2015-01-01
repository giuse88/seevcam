# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notes', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='notes',
            options={'verbose_name': 'notes', 'verbose_name_plural': 'notes'},
        ),
        migrations.AlterField(
            model_name='notes',
            name='interview',
            field=models.OneToOneField(db_column='interview_id', to='interviews.Interview'),
            preserve_default=True,
        ),
        migrations.AlterModelTable(
            name='notes',
            table='notes',
        ),
    ]
