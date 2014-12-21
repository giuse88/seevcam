define(function (require) {
  var BaseView = require('baseView');
  var AnswerView = require('views/answerView');

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

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.hasSubView('.question-answer', new AnswerView({model: this.answer}));
    },

    questionNumber: function (question) {
      return this.questions.indexOf(question) + 1;
    },

    totalQuestionsCount: function () {
      return this.questions.length;
    },

    previousQuestionUrl: function () {
      var result = '';
      var questionIndex = this.questionIndex();
      if (questionIndex > 0) {
        var previousQuestion = this.questions.at(questionIndex - 1);
        result = this.questionUrl(previousQuestion.id);
      }

      return result;
    },

    nextQuestionUrl: function () {
      var result = '';
      var questionIndex = this.questionIndex();
      if (questionIndex < this.questions.length - 1) {
        var nextQuestion = this.questions.at(questionIndex + 1);
        result = this.questionUrl(nextQuestion.id);
      }

      return result;
    },

    questionIndex: function () {
      return this.questions.indexOf(this.model);
    },

    questionUrl: function (questionId) {
      return '/#/interview/questions/' + questionId;
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