define(function (require) {

  var Backbone = require('backbone');
  var QuestionsPage = require('views/interview/questionsPage');
  var DocumentPage = require('views/interview/documentPage');
  var ReviewPage = require('views/review/reviewPage');
  var PresencePage = require('views/presence/presencePage');
  var FullVideoPage = require("views/presence/fullVideoPage");
  var File = require('models/file');

  return Backbone.Router.extend({
    routes: {
      'interview/questions(/)(:questionId)': 'questions',
      'interview/jobSpec': 'jobSpec',
      'interview/cv': 'cv',
      'interview(/)': 'interview',
      'interview/full-video(/)': 'fullVideo',
      'review(/)': 'review'
    },

    initialize: function () {
      this.$container = $('.main-content');
      console.log("Router initialized");
    },

    interview: function () {
      console.log("interview");
      var session = require('services/session');
      this.renderPage(new PresencePage({model: session}));
    },

    fullVideo : function () {
      console.log("full video");
      var session = require('services/session');
      this.renderPage(new FullVideoPage({model: session}));
    },

    questions: function (questionId) {
      console.log("questions");
      var session = require('services/session');
      questionId = parseInt(questionId) || session.get('questions').first().get('id');

      var eventLogger = require('services/eventLogger');
      eventLogger.log(eventLogger.eventType.QUESTION_SELECTED, {question_id: questionId});

      this.renderPage(new QuestionsPage({model: session, questionId: questionId}));
    },

    jobSpec: function () {
      var session = require('services/session');
      var jobSpecId = session.get('jobPosition').get('job_specification');
      this.renderDocumentPage(jobSpecId);
    },

    cv: function () {
      var session = require('services/session');
      var cvId = session.get('candidate').get('cv');
      this.renderDocumentPage(cvId);
    },

    review: function () {
      var session = require('services/session');
      this.renderPage(new ReviewPage({model: session}));
    },

    renderPage: function (page) {
      if (this.currentPage) {
        this.currentPage.teardown();
      }

      this.currentPage = page;
      this.$container.empty().append(this.currentPage.$el);
      this.currentPage.render();
    },

    renderDocumentPage: function (documentId) {
      var documentFile = new File({id: documentId});
      var self = this;

      documentFile.fetch()
        .done(function () {
          self.renderPage(new DocumentPage({model: documentFile}));
        });
    }
  });
});