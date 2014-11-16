# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'UserNotifications'
        db.create_table('user_notifications', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('notification_when_room_is_open', self.gf('django.db.models.fields.BooleanField')(default=True)),
            ('notification_day_before', self.gf('django.db.models.fields.BooleanField')(default=False)),
        ))
        db.send_create_signal(u'userprofile', ['UserNotifications'])

        # Adding model 'UserIntegration'
        db.create_table('user_applications', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
        ))
        db.send_create_signal(u'userprofile', ['UserIntegration'])


    def backwards(self, orm):
        # Deleting model 'UserNotifications'
        db.delete_table('user_notifications')

        # Deleting model 'UserIntegration'
        db.delete_table('user_applications')


    models = {
        u'userprofile.userintegration': {
            'Meta': {'object_name': 'UserIntegration', 'db_table': "'user_applications'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'userprofile.usernotifications': {
            'Meta': {'object_name': 'UserNotifications', 'db_table': "'user_notifications'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'notification_day_before': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'notification_when_room_is_open': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        }
    }

    complete_apps = ['userprofile']