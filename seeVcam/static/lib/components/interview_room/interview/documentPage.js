define(function (require) {
  var InterviewPage = require('./interviewPage');
  var DocumentView = require('../controls/documentView');

  return InterviewPage.extend({
    createContentView: function () {
      return new DocumentView({model: this.model});
    }
  });
});