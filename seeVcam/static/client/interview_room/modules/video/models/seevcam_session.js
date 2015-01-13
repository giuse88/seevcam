define(function (require) {

  var Backbone = require("backbone");
  var OT = require("opentok");

  return Backbone.Model.extend({

    defaults : {
      apiKey : null,
      sessionId : null,
      remoteConnection : null,
      localConnection : null,
      localStatus : null,
      remoteStatus : null
    },

    initialize : function (options) {

      this.set('apiKey', options.apiKey);
      this.set('sessionId', options.sessionId);

      var session = OT.initSession(options.apiKey, options.sessionId);
      this.session = session;
      this.set('session', session);

      session.on('sessionConnected', this.sessionConnected, this)
             .on('sessionDisconnected', this.sessionDisconnected, this)
             .on('connectionCreated', this.connectionCreated, this)
             .on('connectionDestroyed', this.connectionDestroyed, this);
    },

    sessionConnected: function() {
      console.log('Seevcam: sessionConnected');
    },

    sessionDisconnected: function() {
      console.log('Seevcam: sessionDisconnected');
      this.session.off();
      this.session = null;
      this.remoteConnection = null;
      this.localConnection = null;
    },

    connectionCreated: function(event) {
      console.log('Seevcam: connectionCreated');
      if (event.connection.connectionId !== this.session.connection.connectionId) {
        console.log('seevcam: remote user has connected to chat');
        this.remoteConnection = event.connection;
      } else {
        console.log('seevcam: remote user has connected to chat');
        this.localConnection = event.connection;
      }
    },

    end: function() {
      console.log('Seevcam: end');
      this.session.disconnect();
    },

    connectionDestroyed: function(event) {
      console.log('Chat: connectionDestroyed');
      if (event.connection.connectionId === this.remoteConnection.connectionId) {
        console.log('Chat: remote user has left the chat, ending');
        this.end();
      } else {
        console.log('Chat: connectionDestroyed but was not equal to remote user connection');
      }
    }

  });

});

