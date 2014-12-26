define(function (require) {
  var BaseView = require('baseView');
  var OverallRatingListView = require('views/overallRatingListView');
  var AnswerListView = require('views/answerListView');

  return BaseView.extend({
    template: require('text!templates/review-page.html'),

    setUp: function () {
      this.hasSubView('.content', new AnswerListView({collection: this.model.get('answers'), questions: this.model.get('questions')}));
    },

    postRender: function () {
      this.openModal(new OverallRatingListView({collection: this.model.get('overallRatings')}), {
        okText: 'Next',
        allowCancel: false,
        footer: true
      });
    }
  });
});