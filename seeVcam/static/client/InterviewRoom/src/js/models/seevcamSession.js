define(function (require) {

  var Backbone = require("backbone");
  var OT = require("opentok");

  var states = {
    CONNECTED  : "CONNECTED",
    BLOCKED    : "BLOCKED",
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
             .on("signal:statusUpdate", this.remoteStateUpdate, this);

      this.connect()

    },

    remoteStateUpdate : function (event){
      console.log("Updated status");
      var data = event.data;
      this.set('remoteState', data.state);
    },

    sessionConnected: function() {
      console.log('Seevcam: sessionConnected');
      // add local video to the page
      this.set('localState', states.CONNECTED);
      this.publisherProperties = {width: 640, height:480};
      this.publisher = OT.initPublisher('video-container', this.publisherProperties);

      this.publisher
        .on("accessAllowed", this.accessToMediaGranted, this)
        .on("accessDenied", this.accessToMediaDenied, this);

      this.session.publish(this.publisher);
    },

    connect : function () {
      console.log("connecting");
      this.session.connect(this.get("token"));
    },

    sessionDisconnected: function() {
      console.log('Seevcam: sessionDisconnected');
      this.session.off();
      this.publisher.off();
      this.session = null;
      this.remoteConnection = null;
      this.localConnection = null;
    },

    connectionCreated: function(event) {
      console.log('Seevcam: connectionCreated');
      if (event.connection.connectionId !== this.session.connection.connectionId) {
        console.log('seevcam: remote user has connected to chat');
        this.remoteConnection = event.connection;
        this.set('remoteState', states.CONNECTED);
        this.propagateLocalState();
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

    propagateLocalState : function () {
      this.sendSignal({state: this.get('localState') }, "statusUpdate")
    },

    accessToMediaGranted : function (event) {
      console.log("Access to media granted");
      this.set('localState', states.READY);
      this.propagateLocalState();
    },

    accessToMediaDenied: function (event) {
      console.log("Access to media denied");
      this.set('localState', states.BLOCKED);
      this.propagateLocalState();
    },

    sendSignal: function(data, type) {
      this.session.signal({ to: this.remoteConnection, data:data, type:type },
        function (error) {
          if (error) {
            console.log("signal error (" + error.code + "): " + error.reason); }
          else {
            console.log("signal sent.");
          }
      });
    }

  });

});

