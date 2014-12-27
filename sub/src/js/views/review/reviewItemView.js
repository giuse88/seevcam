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
      this.hasSubView('.question-container', new QuestionView({model: this.question}));

      if (this.model.hasContent()) {
        this.hasSubView('.answer-container', new AnswerView({model: this.model}));
      }

      if (this.model.hasRating()) {
        this.hasSubView('.rating-container', new RatingView({model: this.model}));
      }
    }
  });
});