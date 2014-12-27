define(function (require) {
  var BaseView = require('baseView');
  var QuestionView = require('views/review/questionView');
  var AnswerView = require('views/review/answerView');
  var RatingView = require('views/review/ratingView');

  return BaseView.extend({
    template: require('text!templates/review/review-item.html'),

    initialize: function (options) {
      this.question = options.question;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.attachSubView('.question-container', new QuestionView({model: this.question}));
      this.attachSubView('.answer-container', new AnswerView({model: this.model}));
      this.attachSubView('.rating-container', new RatingView({model: this.model}));
    }
  });
});