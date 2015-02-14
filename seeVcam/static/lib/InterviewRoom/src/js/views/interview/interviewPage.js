define(function (require) {
  var BaseView = require('baseView');
  var CandidateInfoView = require('views/interview/candidateInfoView');
  var EventListView = require('views/interview/eventListView');
  var NavigationBarView = require('views/interview/navigationBarView');
  var Navigator = require("navigator");

  return BaseView.extend({
    className: 'interview-page',
    template: require('text!templates/interview/interview-page.html'),

    events : {
      'click .conclude-control' : 'goToReview'
    },

    setUp: function () {
      var session = require('services/session');
      this.attachSubView('.candidate-info-container', new CandidateInfoView({model: session}));
      this.attachSubView('.events-container', new EventListView({collection: session.get('events')}));
      this.attachSubView('.navigation-bar', new NavigationBarView({collection: session.get('events')}));
    },

    postRender : function () {
      this.$content = this.$el.find('.content');
    },

    goToReview : function () {
      console.log("Go to review");
      Navigator.goToGoodBye();
    },

    addContent : function ( innerView ) {
      if (this.innerView) {
        this.detachSubView(this.innerView);
      }

      this.innerView = innerView;
      this.attachSubView('.content', innerView);
    }

  });

});