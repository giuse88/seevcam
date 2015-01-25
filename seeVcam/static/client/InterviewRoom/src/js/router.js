define(function (require) {

  var Backbone = require('backbone');
  var QuestionsPage = require('views/interview/questionsPage');
  var DocumentPage = require('views/interview/documentPage');
  var ReviewPage = require('views/review/reviewPage');
  var PresencePage = require('views/presence/presencePage');
  var FullVideoPage = require("views/presence/fullVideoPage");
  var File = require('models/file');
  var InterviewPage = require("views/interview/interviewPage");

  return Backbone.Router.extend({

    routes: {

      'interview/questions(/)(:questionId)': 'questions',
      'interview/jobSpec': 'jobSpec',
      'interview/cv': 'cv',

      'interview(/)': 'interview',
      'interview/interviewee(/)': 'interview',

      'interview/full-video(/)': 'fullVideo',
      'review(/)': 'review'
    },

    initialize: function () {
      this.$container = $('.main-content');
      console.log("Router initialized");
    },

    interview: function () {
      var session = require('services/session');
      this.renderPage(new PresencePage({model: session}));
    },

    fullVideo : function () {
      console.log("full video");
      var session = require('services/session');
      this.renderPage(new FullVideoPage({model: session}));
    },


    // =================== Inner view ====================//

    questions: function (questionId) {

      console.log("questions");

      this.initializeInterviewPage();

      var session = require('services/session');
      questionId = parseInt(questionId) || session.get('questions').first().get('id');

      var eventLogger = require('services/eventLogger');
      eventLogger.log(eventLogger.eventType.QUESTION_SELECTED, {question_id: questionId});

//      this.renderPage(new QuestionsPage({model: session, questionId: questionId}));
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

    // ====================== end =========================//

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

    initializeInterviewPage : function () {
     if(!this.$interviewPage) {
       this.$interviewPage = new InterviewPage();
       this.renderPage(this.$interviewPage);
     }
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