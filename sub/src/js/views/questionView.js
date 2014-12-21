define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/question.html'),

    events: {
      'mouseover .question[data-question-id]': 'onQuestionButtonOver',
      'mouseleave .question[data-question-id]': 'onQuestionButtonLeave'
    },

    initialize: function (options) {
      this.questions = options.questions;
      this.answers = options.answers;
      this.answer = options.answer;
    },

    questionNumber: function (question) {
      return this.questions.indexOf(question) + 1;
    },

    totalQuestionsCount: function () {
      return this.questions.length;
    },

    previousQuestionUrl: function () {
      var questionIndex = this.questionIndex();
      if (questionIndex > 0) {
        var previousQuestion = this.questions.at(questionIndex - 1);
        return this.questionUrl(previousQuestion.id);
      }
    },

    nextQuestionUrl: function () {
      var questionIndex = this.questionIndex();
      if (questionIndex < this.questions.length - 1) {
        var nextQuestion = this.questions.at(questionIndex + 1);
        return this.questionUrl(nextQuestion.id);
      }
    },

    questionIndex: function () {
      return this.questions.indexOf(this.model);
    },

    questionUrl: function (questionId) {
      return '/#/interview/questions/' + questionId;
    },

    questionButtonClass: function (question) {
      var classes = ['question'];

      if (!this.answer.empty()) {
        classes.push('answered');
      }
      var rating = this.answer.get('rating');
      if (rating != null && rating != undefined) {
        if (rating < 4) {
          classes.push('negative');
        } else if (rating < 8) {
          classes.push('neuter');
        } else {
          classes.push('positive');
        }
      }

      if (question == this.model) {
        classes.push('current');
      }

      return classes.join(' ');
    },

    onQuestionButtonOver: function (e) {
      var questionId = $(e.currentTarget).data('question-id');
      var question = this.questions.findWhere({id: questionId});
      var $questionPreview = this.$('.question-selection-preview');
      $questionPreview.find('.number').text(this.questionNumber(question));
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