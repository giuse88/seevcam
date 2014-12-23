define(function (require) {
  var BaseView = require('baseView');
  var QuestionPresenter = require('presenters/questionPresenter');

  return BaseView.extend({
    template: require('text!templates/question-navigation.html'),

    events: {
      'mouseover .question[data-question-id]': 'onQuestionButtonOver',
      'mouseleave .question[data-question-id]': 'onQuestionButtonLeave'
    },

    initialize: function (options) {
      this.answers = options.answers;
      this.currentQuestion = options.currentQuestion;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    questionUrl: function (question) {
      return QuestionPresenter.questionUrl(question);
    },

    questionButtonClass: function (question) {
      var classes = ['question'];

      var questionAnswer = this.answers.findWhere({question: question.id});
      if (!questionAnswer.empty()) {
        classes.push('answered');
      }
      var rating = questionAnswer.get('rating');
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

      if (question == this.currentQuestion) {
        classes.push('current');
      }

      return classes.join(' ');
    },

    onQuestionButtonOver: function (e) {
      var questionId = $(e.currentTarget).data('question-id');
      var question = this.collection.findWhere({id: questionId});
      var $questionPreview = this.$('.question-selection-preview');
      $questionPreview.find('.number').text(QuestionPresenter.questionNumber(question));
      $questionPreview.find('.text').text(question.get('question_text'));
      $questionPreview.removeClass('not-visible').addClass('visible');
    },

    onQuestionButtonLeave: function () {
      var $questionPreview = this.$('.question-selection-preview');
      $questionPreview.find('.number').text('');
      $questionPreview.find('.text').text('');
      $questionPreview.removeClass('visible').addClass('not-visible');
    }
  });
});