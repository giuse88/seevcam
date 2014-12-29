define(function (require) {
  var BaseView = require('baseView');
  var QuestionPresenter = require('presenters/questionPresenter');
  var AnswerPresenter = require('presenters/answerPresenter');

  return BaseView.extend({
    tagName: 'a',

    attributes: function () {
      return {
        href: QuestionPresenter.questionUrl(this.model),
        'data-question-id': this.model.id,
        'class': this.questionButtonClass(this.options.answer, this.options.isSelected)
      };
    },

    propagatedEvents: {
      'mouseover': 'mouseover',
      'mouseleave': 'mouseleave'
    },

    initialize: function (options) {
      this.answer = options.answer;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.listenTo(this.answer, 'change', this.onAnswerChanged, this);
    },

    questionButtonClass: function (answer, isSelected) {
      var classes = ['question'];

      if (answer.hasContent()) {
        classes.push('answered');
      }

      if (answer.hasRating()) {
        classes.push('rated');

        classes.push(AnswerPresenter.ratingType(answer));
      }

      if (isSelected) {
        classes.push('current');
      }

      return classes.join(' ');
    },

    onAnswerChanged: function () {
      this.$el.attr(_.result(this, 'attributes'));
    }
  });
});