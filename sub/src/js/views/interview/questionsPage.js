define(function (require) {
  var InterviewPage = require('views/interview/interviewPage');
  var QuestionView = require('views/interview/questionView');

  return InterviewPage.extend({
    createContentView: function () {
      var questions = this.model.get('questions');
      var question = questions.findWhere({id: this.options.questionId});
      var answers = this.model.get('answers');
      var answer = answers.findWhere({question: question.id});
      var notes = this.model.get('notes');

      return new QuestionView({
        model: question,
        answer: answer,
        questions: questions,
        answers: answers,
        notes: notes
      });
    }
  })
});