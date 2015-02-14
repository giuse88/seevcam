define(function (require) {
  var BaseView = require('baseView');
  var QuestionPresenter = require('presenters/questionPresenter');

  return BaseView.extend({
    template: require('text!./templates/question-preview.html'),

    questionNumber: function () {
      return QuestionPresenter.questionNumber(this.model);
    },

    totalQuestions: function () {
      return this.model.collection.length;
    }
  });
});