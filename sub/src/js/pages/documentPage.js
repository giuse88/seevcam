define(function (require) {
  var InterviewPage = require('pages/interviewPage');
  var DocumentView = require('views/documentView');

  return InterviewPage.extend({
    createContentView: function () {
      return new DocumentView({model: this.model});
    }
  });
});