define(function (require) {
  var BaseView = require('baseView');
  var InterviewInfoBar = require('views/presence/interviewInfoBar');

  return BaseView.extend({
    template: require('text!templates/presence/presence-page.html'),

    initialize: function (options) {
      console.log("hello");
    },

    setUp: function () {
      this.attachSubView('.interview-info-bar', new InterviewInfoBar({model : this.model}));
    }
  });
});
