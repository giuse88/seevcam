# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding field 'UserNotifications.notification_hour_before'
        db.add_column('user_notifications', 'notification_hour_before',
                      self.gf('django.db.models.fields.BooleanField')(default=False),
                      keep_default=False)


    def backwards(self, orm):
        # Deleting field 'UserNotifications.notification_hour_before'
        db.delete_column('user_notifications', 'notification_hour_before')


    models = {
        u'userprofile.userintegration': {
            'Meta': {'object_name': 'UserIntegration', 'db_table': "'user_applications'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'})
        },
        u'userprofile.usernotifications': {
            'Meta': {'object_name': 'UserNotifications', 'db_table': "'user_notifications'"},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'notification_day_before': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'notification_hour_before': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'notification_when_room_is_open': ('django.db.models.fields.BooleanField', [], {'default': 'True'})
        }
    }

    complete_apps = ['userprofile']