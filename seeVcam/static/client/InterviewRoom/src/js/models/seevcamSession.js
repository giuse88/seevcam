define(function (require) {

  var Backbone = require("backbone");
  var OT = require("opentok");

  var states = {
    CONNECTED  : "CONNECTED",
    READY      : "READY",
    OFFLINE    : "OFFLINE",
    UNKNOWN    : "UNKNOWN"
  }

  return Backbone.Model.extend({

    defaults : {
      apiKey : null,
      sessionId : null,
      remoteConnection : null,
      localConnection : null,
      localState : states.OFFLINE,
      remoteState : states.UNKNOWN
    },

    initialize : function (options) {

      this.set('apiKey', options.apiKey);
      this.set('sessionId', options.sessionId);
      this.set('token', options.token);

      console.log("Created session with the following options", options);

      var session = OT.initSession(options.apiKey, options.sessionId);

      this.session = session;

      session.on('sessionConnected', this.sessionConnected, this)
             .on('sessionDisconnected', this.sessionDisconnected, this)
             .on('connectionCreated', this.connectionCreated, this)
             .on('connectionDestroyed', this.connectionDestroyed, this)
             .on("signal:statusUpdate", this.statusUpdate, this);

      this.connect()
    },

    statusUpdate : function (event){

    },

    sessionConnected: function() {
      console.log('Seevcam: sessionConnected');
      // add local video to the page
      this.set('localState', states.CONNECTED);
      this.publisherProperties = {width: 640, height:480};
      this.publisher = OT.initPublisher('video-container', this.publisherProperties);
      this.session.publish(this.publisher);
    },

    connect : function () {
      console.log("connecting");
      this.session.connect(this.get("token"));
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
      console.log(event);
      if (event.connection.connectionId !== this.session.connection.connectionId) {
        console.log('seevcam: remote user has connected to chat');
        this.remoteConnection = event.connection;
        this.set('remoteState', states.CONNECTED);
        // TODO send ready signal
      } else {
        console.log('seevcam: local user has connected to chat');
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
        this.set('remoteState', states.OFFLINE)
      } else {
        console.log('Chat: connectionDestroyed but was not equal to remote user connection');
      }
    },

    // function called when the local peeer is ready
    localReady : function () {

    },

    sendReadySignal : function () {

    }

  });

});

