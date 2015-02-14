define(function (require) {
  var BaseView = require('baseView');
  var QuestionView = require('./questionView');
  var AnswerView = require('./answerView');
  var RatingView = require('./ratingView');

  return BaseView.extend({
    template: require('text!./templates/review-item.html'),

    initialize: function (options) {
      this.question = options.question;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.attachSubView('.question-container', new QuestionView({model: this.question}));
      this.attachSubView('.answer-container', new AnswerView({model: this.model, question: this.question}));
      this.attachSubView('.rating-container', new RatingView({model: this.model}));
    }
  });
});