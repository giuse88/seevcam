define(function (require) {
  var InterviewPage = require('pages/interviewPage');
  var QuestionView = require('views/questionView');

  return InterviewPage.extend({
    createContentView: function () {
      var questions = this.model.get('questions');
      var question = questions.findWhere({id: this.options.questionId}) || questions.first();
      var answers = this.model.get('answers');
      var answer = answers.findWhere({question: question.id});

      return new QuestionView({
        model: question,
        answer: answer,
        questions: questions,
        answers: answers
      });
    }
  })
});