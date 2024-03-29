define(function (require) {

  var Backbone = require("backbone");
  var OT = require("opentok");
  var Navigator = require("navigator");

  var states = {
    CONNECTED  : "CONNECTED",
    BLOCKED    : "BLOCKED",
    READY      : "READY",
    OFFLINE    : "OFFLINE",
    NOT_READY  : "NOT_READY",
    UNKNOWN    : "UNKNOWN"
  };

  var videoDimension = {
    width: 1280,
    height: 720,
    buttonDisplayMode : "auto",
    videoDisabledDisplayMode:"on"
  };

  return Backbone.Model.extend({

    defaults : {
      apiKey : null,
      sessionId : null,
      accepted : false,
      remoteConnection : null,
      localConnection : null,
      localState : states.OFFLINE,
      remoteState : states.UNKNOWN,
      interviewState : states.NOT_READY,
      remoteStream : null,
      role : "unknown",
      publisherProperties : videoDimension,
      subscriberProperties : videoDimension
    },

    initialize : function (options) {

      this.set('apiKey', options.apiKey);
      this.set('sessionId', options.sessionId);
      this.set('token', options.token);
      this.set('role', options.role);

      console.log("Created session with the following options", options);

      var session = OT.initSession(options.apiKey, options.sessionId);

      this.session = session;

      session.on('sessionConnected', this.sessionConnected, this)
             .on('sessionDisconnected', this.sessionDisconnected, this)
             .on('connectionCreated', this.connectionCreated, this)
             .on('connectionDestroyed', this.connectionDestroyed, this)
             .on("streamCreated",this.streamCreated, this)
             .on("signal:statusUpdate", this.remoteStateUpdate, this)
             .on("signal:start-interview", this.goToFullVideo, this)
             .on("signal:end-interview", this.endInterview, this);

      this.listenTo(this, 'change:localState', this.updateInterviewState, this);
      this.listenTo(this, 'change:remoteState', this.updateInterviewState, this);

      this.connect()

    },

    /* Public interface */

    /**
      initPublisher :
         domElementId : video container
         conf : publisher conf
     */

    initPublisher : function (domElementId, conf) {
      var publisherProperty = conf || this.get("publisherProperties");
      console.log("Init publisher with properties :  ", publisherProperty) ;
      this.publisher =  OT.initPublisher(domElementId, publisherProperty);
      debugger;
      this.set('publisher', this.publisher);
      this.publisher
        .on("accessAllowed", this.accessToMediaGranted, this)
        .on("accessDenied", this.accessToMediaDenied, this)
        .on("streamCreated", this.localStreamCreated, this);
      console.log("Publisher created successfully.") ;
      return this.publisher;
    },

    /**
     * publish :
     *   publish video in the session
     */

    publish : function () {
      if (this.publisher) {
        this.session.publish(this.publisher);
      } else {
        throw "Publisher not initialized."
      }
    },

    /**
     * subscribe  :
     *   subscribe to a remote stream video in the session
     */

    subscribe : function (domElement, conf) {
      var publisherProperty = conf || this.get("subscriberProperties");
      var stream = this.get("remoteStream");

      if (!domElement) {
        throw "Invalid dom element";
      }

      if (!stream) {
        throw "Remote stream is not initialized";
      }

      console.log("Subscribing to a remote stream : ", conf);
      this.subscriber = this.session.subscribe(stream, domElement, publisherProperty);

      return this.subscriber;
    },

    /**
     * getPublisher :  return the publisher
     */

    getPublisher : function () {
      return this.publisher;
    },

    hasRemoteStream : function (){
     return !!this.remoteStream;
    },

    /**
     * getSubscriber :  return the subscriber object
     */

    getSubscriber :function () {
      return this.subscriber;
    },

    /* Private methods */
    remoteStateUpdate : function (event){
      console.log("Updated status");
      var data = event.data;
      this.set('remoteState', data.state);
    },

    streamCreated : function (event) {
      console.log("Remote stream created");
      this.remoteStream = event.stream;
      this.set("remoteStream", event.stream);
      console.log("remote dimension", this.remoteStream.videoDimensions);
      console.log(".........I'm receiving a stream.......");
      console.log(this.remoteStream);
      console.log("remote Stream");
    },

    goToFullVideo : function (e) {
      e.preventDefault();
      if (this.isInterviewReady()) {
        console.log("go to interview video ready");
        Navigator.goToFullVideoView();
      } else {
        console.log("Interview is not ready");
      }
    },

    sessionConnected: function() {
      console.log('Seevcam: sessionConnected');
      // add local video to the page
      this.set('localState', states.CONNECTED);
    },

    localStreamCreated : function  (event) {
      event.preventDefault();
      console.log(event);
    },

    connect : function () {
      console.log("connecting");
      this.session.connect(this.get("token"));
    },

    closeConnection: function () {
      console.log("closing connection");
      this.sendSignal({message:"end interview" }, "end-interview");
      this.session.unpublish(this.publisher);
      this.session.unsubscribe(this.subscriber);
      this.sessionDisconnected();
      this.session.disconnect();
    },

    endInterview : function () {
      console.log("Recieved end interview signal");
      this.session.unpublish(this.publisher);
      this.session.unsubscribe(this.subscriber);
//      this.sessionDisconnected();
//      this.session.disconnect();
      Navigator.goToEndInterviewPage();
    },

    sessionDisconnected: function(e) {
      console.log('Seevcam: sessionDisconnected');
      this.session.off();
      this.publisher.off();
    },

    connectionCreated: function(event) {
      console.log('Seevcam: connectionCreated');
      if (event.connection.connectionId !== this.session.connection.connectionId) {
        console.log('seevcam: remote user has connected to chat');
        this.remoteConnection = event.connection;
        this.propagateLocalState();
      } else {
        console.log('seevcam: local user has connected to chat');
        this.localConnection = event.connection;
      }
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

    updateInterviewState : function () {
     console.log("Updating interview state");
     if ( this.get("localState") === states.READY && this.get("remoteState") === states.READY)  {
       this.set("interviewState", states.READY);
     } else {
       this.set("interviewState", states.NOT_READY);
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

    isInterviewReady : function ( ) {
      return this.get("interviewState") === "READY";
    },

    startInterview : function () {
      this.sendSignal({message:"start interview" }, "start-interview");
    },

    sendSignal: function(data, type) {
      this.session.signal({ to: this.remoteConnection, data:data, type:type },
        function (error) {
          if (error) {
            console.log("signal error (" + error.code + "): " + error.reason);
            console.log(data,type);
          } else {
            console.log("signal sent.");
          }
      });
    }

  });

});

