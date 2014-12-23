define(function (require) {
  var BaseView = require('baseView');
  var AnswerView = require('views/answerView');
  var NotesView = require('views/notesView');
  var QuestionNavigationView = require('views/questionNavigationView');
  var QuestionPresenter = require('presenters/questionPresenter');

  return BaseView.extend({
    template: require('text!templates/question.html'),

    initialize: function (options) {
      this.questions = options.questions;
      this.answers = options.answers;
      this.answer = options.answer;
      this.notes = options.notes;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.hasSubView('.answer-container', new AnswerView({model: this.answer}));
      this.hasSubView('.notes-container', new NotesView({model: this.notes}));
      this.hasSubView('.question-navigation-container', new QuestionNavigationView({collection: this.questions, currentQuestion: this.model, answers: this.answers}));
    },

    questionNumber: function (question) {
      return QuestionPresenter.questionNumber(question);
    },

    previousQuestionUrl: function () {
      return QuestionPresenter.previousQuestionUrl(this.model);
    },

    nextQuestionUrl: function () {
      return QuestionPresenter.nextQuestionUrl(this.model);
    }
  });
});