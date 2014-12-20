define(function (require) {
  var InterviewPage = require('pages/interviewPage');
  var QuestionView = require('views/questionView');

  return InterviewPage.extend({
    createContentView: function () {
      return new QuestionView();
    }
  })
});