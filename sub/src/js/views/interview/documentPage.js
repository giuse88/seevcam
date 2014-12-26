define(function (require) {
  var InterviewPage = require('views/interview/interviewPage');
  var DocumentView = require('views/controls/documentView');

  return InterviewPage.extend({
    createContentView: function () {
      return new DocumentView({model: this.model});
    }
  });
});