define(function (require) {
  var BaseView = require('baseView');
  var QuestionPresenter = require('presenters/questionPresenter');

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

      if (!answer.empty()) {
        classes.push('answered');
      }
      var rating = answer.get('rating');
      if (rating != null && rating != undefined) {
        classes.push('rated');

        if (rating < 4) {
          classes.push('negative');
        } else if (rating < 8) {
          classes.push('neuter');
        } else {
          classes.push('positive');
        }
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