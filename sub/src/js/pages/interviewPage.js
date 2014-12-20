define(function (require) {
  var BaseView = require('baseView');
  var CandidateInfoView = require('views/candidateInfoView');
  var EventListView = require('views/eventListView');
  var NavigationBarView = require('views/navigationBarView');
  var QuestionView = require('views/questionView');

  return BaseView.extend({
    template: require('text!templates/interview-page.html'),

    setUp: function () {
      var session = require('services/session');

      this.hasSubView('.candidate-info-container', new CandidateInfoView({model: session}));
      this.hasSubView('.events-container', new EventListView({collection: session.get('events')}));
      this.hasSubView('.navigation-bar', new NavigationBarView({collection: session.get('events')}));

      switch (this.options.type) {
        case 'cv':
          this.hasSubView('.content', new QuestionView());
          break;
        case 'jobSpec':
          this.hasSubView('.content', new QuestionView());
          break;
        case 'questions':
          this.hasSubView('.content', new QuestionView());
          break;
      }
    }
  });
});