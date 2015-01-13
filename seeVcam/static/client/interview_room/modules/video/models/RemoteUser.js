define(function (require) {

  var Backbone = require("backbone");

  return Backbone.Model.extend({

    defaults: {
      name: null,
      status: 'online',
    },

    initialize: function (attrs, options) {
      if (!options.presenceSession) {
        throw Error('Remote user cannot be initialized without a presence session');
      }
      this.presenceSession = options.presenceSession;

      if (!options.connection) {
        throw Error('Remote user cannot be initialized without a connection');
      }
      this.connection = options.connection;

      var connectionData = JSON.parse(this.connection.data);
      this.set('name', connectionData.name);

      this.presenceSession.on('signal:' + this.connection.connectionId + '~status',
        this.remoteStatusUpdated,
        this);
      this.on('change:status', this.statusChanged, this);
    },

    statusChanged: function (self, status) {
      log.info('RemoteUser: statusChanged', status);
      this.set('available', _.include(this.availableStatuses, status));
    },

    remoteStatusUpdated: function (event) {
      log.info('RemoteUser: remoteStatusUpdated', event);
      this.set('status', event.data);
    }
  });

});

