define(function (require) {
  var BaseView = require('baseView');
  var AnswerView = require('./answerView');
  var NotesView = require('./notesView');
  var QuestionNavigationView = require('./questionNavigationView');
  var QuestionPresenter = require('presenters/questionPresenter');

  return BaseView.extend({
    template: require('text!./templates/question.html'),

    initialize: function (options) {
      this.questions = options.questions;
      this.answers = options.answers;
      this.answer = options.answer;
      this.notes = options.notes;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    events : {
      'click .arrow.right' : 'goToNextQuestion',
      'click .arrow.left' : 'goToPreviousQuestion'
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
    },

    goToNextQuestion : function () {
      window.router.navigate(QuestionPresenter.nextQuestionUrl(this.model), {trigger:true});
    },

    goToPreviousQuestion : function () {
      window.router.navigate(QuestionPresenter.previousQuestionUrl(this.model), {trigger:true});
    }

  });
});