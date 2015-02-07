define(function (require) {

  var BaseView = require('baseView');
  var Navigator = require("navigator");

  return BaseView.extend({

    template  : require('text!templates/presence/full-video-page.html'),

     events : {
      'click a'  : 'goToQuestion'
    },

    defaults : {
      isGoodByePage : false
    },

    initialize: function (options) {

      this.options = _.extend(this.defaults, options);
      this.videoSession = this.model.get("videoSession");

      if ( !this.options.isGoodByePage ) {
        this.videoSession.publish();
        this.listenTo(this.videoSession, 'change:remoteStream', this.handleRemoteStream, this);
      } else  {
        this.subscriber = this.videoSession.getSubscriber();
      }
      this.publisher = this.videoSession.getPublisher();

    },

    handleRemoteStream : function () {
      if ( this.videoSession.hasRemoteStream()) {
        this.videoSession.subscribe(this.$remoteContainer[0]);
        this.$remoteContainer
          .height(window.innerHeight)
          .width(window.innerWidth);
        console.log(".........I'm watching a remote stream.......");
      } else  {
        console.log("Not remote stream yet");
      }
    },

    installRemoteVideo : function () {
      this.$localContainer
        .html(this.subscriber && this.subscriber.element)
        .height(window.innerHeight)
        .width(window.innerWidth);
    },

    goToQuestion : function (event) {
      event.preventDefault();
      if (this.options.isGoodByePage) {
        // console.log("End");
        Navigator.goToReview();
      } else {
        Navigator.goToQuestions();
      }
    },

    postRender : function () {
      this.$remoteContainer = this.$el.find('.remote-video-container');
      this.$localContainer = this.$el.find('.local-video-container');
      //  appending the video container for the local video
      this.$localContainer.html(this.publisher.element);
      // setting local video css
      this.$localContainer
        .find('.OT_root')
        .height(240)
        .width(320);
      if (this.isGoodByePage) {
        this.installRemoteVideo();
      } else {
        this.handleRemoteStream();
      }
    }
  });
});