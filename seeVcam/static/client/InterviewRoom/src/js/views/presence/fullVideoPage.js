define(function (require) {

  var BaseView = require('baseView');
  var Navigator = require("navigator");

  return BaseView.extend({

    template  : require('text!templates/presence/full-video-page.html'),

     events : {
      'click a'  : 'goToQuestion'
    },

    initialize: function (options) {

      this.videoSession = this.model.get("videoSession");
      this.videoSession.publish();
      console.log(".........I'm publishing.......");
      this.publisher = this.videoSession.getPublisher();

      this.listenTo(this.videoSession, 'change:remoteStream', this.handleRemoteStream, this);
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

    goToQuestion : function (event) {
      event.preventDefault();
      Navigator.goToQuestions();
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
        .width(320)
      this.handleRemoteStream();
    }
  });
});