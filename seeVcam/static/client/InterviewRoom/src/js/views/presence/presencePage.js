define(function (require) {
  var BaseView = require('baseView');
  var InterviewInfoBar = require('views/presence/interviewInfoBar');
  var StartInterview = require("views/presence/startInterview");

  return BaseView.extend({
    template: require('text!templates/presence/presence-page.html'),

    initialize: function (options) {
    },

    setUp: function () {
      this.attachSubView('.interview-info-bar', new InterviewInfoBar({model : this.model.get("videoSession")}));
      this.attachSubView('.interview-start-container', new StartInterview({model : this.model}));
    }

  });

});
