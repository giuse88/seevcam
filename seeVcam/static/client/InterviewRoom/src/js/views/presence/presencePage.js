define(function (require) {

  var BaseView = require('baseView');
  var InterviewInfoBar = require('views/presence/interviewInfoBar');
  var StartInterview = require("views/presence/startInterview");

  return BaseView.extend({
    template: require('text!templates/presence/presence-page.html'),

    initialize: function (options) {
      this.videoSession = this.model.get("videoSession");
    },

    setUp: function () {
      this.attachSubView('.interview-info-bar', new InterviewInfoBar({ model : this.videoSession }));
      this.attachSubView('.interview-start-container', new StartInterview({ model : this.model }));
    },

    postRender : function () {
      // Getting access to local video
      this.$localVideoContainer = this.$el.find(".video-container");
      this.videoSession.initPublisher(this.$localVideoContainer[0]);
    }

  });

});
