define(function (require) {
  var BaseView = require('baseView');
  var AnswerView = require('views/interview/answerView');
  var NotesView = require('views/interview/notesView');
  var QuestionNavigationView = require('views/interview/questionNavigationView');
  var QuestionPresenter = require('presenters/questionPresenter');

  return BaseView.extend({
    template: require('text!templates/interview/question.html'),

    initialize: function (options) {
      this.questions = options.questions;
      this.answers = options.answers;
      this.answer = options.answer;
      this.notes = options.notes;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.attachSubView('.answer-container', new AnswerView({model: this.answer}));
      this.attachSubView('.notes-container', new NotesView({model: this.notes}));
      this.attachSubView('.question-navigation-container', new QuestionNavigationView({collection: this.questions, currentQuestion: this.model, answers: this.answers}));
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