define(function (require) {
  var InterviewPage = require('./interviewPage');
  var DocumentView = require('components/document_viewer/documentView');

  return InterviewPage.extend({
    createContentView: function () {
      return new DocumentView({model: this.model});
    }
  });
});