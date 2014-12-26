define(function (require) {
  var BaseView = require('baseView');
  var OverallRatingListView = require('views/review/overallRatingListView');
  var AnswerListView = require('views/review/answerListView');

  return BaseView.extend({
    className: 'review-page',
    template: require('text!templates/review/review-page.html'),

    setUp: function () {
      this.hasSubView('.answer-list-container', new AnswerListView({collection: this.model.get('answers'), questions: this.model.get('questions')}));
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