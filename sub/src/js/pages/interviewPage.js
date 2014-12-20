define(function (require) {
  var BaseView = require('baseView');
  var CandidateInfoView = require('views/candidateInfoView');
  var EventListView = require('views/eventListView');

  return BaseView.extend({
    template: require('text!templates/interview-page.html'),

    setUp: function () {
      var session = require('services/session');

      this.hasSubView('.candidate-info-container', new CandidateInfoView({model: session}));
      this.hasSubView('.events-container', new EventListView({collection: session.get('events')}));
    }
  });
});