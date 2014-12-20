define(function (require) {
  var BaseView = require('baseView');
  var CandidateInfoView = require('views/candidateInfoView');

  return BaseView.extend({
    template: require('text!templates/interview-page.html'),

    setUp: function () {
      var session = require('services/session');

      this.hasSubView('.candidate-info-container', new CandidateInfoView({model: session}));
    }
  });
});