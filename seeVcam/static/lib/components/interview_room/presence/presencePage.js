define(function (require) {

  var BaseView = require('baseView');
  var InterviewInfoBar = require('./interviewInfoBar');
  var StartInterview = require("./startInterview");

  return BaseView.extend({
    template: require('text!./templates/presence-page.html'),

    events :  {
       'click [type="checkbox"]': 'acceptAgreement'
    },

    initialize: function (options) {
      this.videoSession = this.model.get("videoSession");
    },

    setUp: function () {
      this.attachSubView('.interview-info-bar', new InterviewInfoBar({ model : this.model}));
      this.attachSubView('.interview-start-container', new StartInterview({ model : this.model }));
    },

    acceptAgreement : function () {
      this.videoSession.set("accepted", true);
      this.$accept.remove();
    },

    postRender : function () {
      // Getting access to local video
      this.$localVideoContainer = this.$el.find(".video-container");
      this.$accept = this.$el.find(".accept-info");
      this.videoSession.initPublisher(this.$localVideoContainer[0]);
    }

  });

});
