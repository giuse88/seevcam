define(function (require) {
  var BaseView = require('baseView');
  var CandidateInfoView = require('views/interview/candidateInfoView');
  var EventListView = require('views/interview/eventListView');
  var NavigationBarView = require('views/interview/navigationBarView');

  return BaseView.extend({
    className: 'interview-page',
    template: require('text!templates/interview/interview-page.html'),

    setUp: function () {
      var session = require('services/session');

      this.attachSubView('.candidate-info-container', new CandidateInfoView({model: session}));
      this.attachSubView('.events-container', new EventListView({collection: session.get('events')}));
      this.attachSubView('.navigation-bar', new NavigationBarView({collection: session.get('events')}));

      this.attachSubView('.content', this.createContentView());
    },

    createContentView: function () {
      throw 'Not Implemented';
    }
  });
});