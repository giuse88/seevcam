define(function (require) {

  var Backbone = require('backbone');
  var QuestionView = require("views/interview/questionView");
  var DocumentPage = require('views/interview/documentPage');
  var ReviewPage = require('views/review/reviewPage');
  var PresencePage = require('views/presence/presencePage');
  var FullVideoPage = require("views/presence/fullVideoPage");
  var File = require('models/file');
  var InterviewPage = require("views/interview/interviewPage");

  return Backbone.Router.extend({

    routes: {

      'interview/questions(/)(:questionId)': 'questions',
      'interview/job-spec': 'jobSpec',
      'interview/cv': 'cv',

      'interview(/)': 'interview',
      'interview/interviewee(/)': 'interview',

      'interview/full-video(/)': 'fullVideo',
      'review(/)': 'review'
    },

    initialize: function () {
      this.$container = $('.main-content');
      this.session = require('services/session');
      console.log("Router initialized");
    },

    interview: function () {
      this.renderPage(new PresencePage({model: this.session}));
    },

    fullVideo : function () {
      console.log("full video");
      this.renderPage(new FullVideoPage({model: this.session}));
    },


    // =================== Inner view ====================//

    questions: function (questionId) {

      console.log("questions");

      this.initializeInterviewPage();

      questionId = parseInt(questionId) || this.session.get('questions').first().get('id');

      var eventLogger = require('services/eventLogger');
      eventLogger.log(eventLogger.eventType.QUESTION_SELECTED, {question_id: questionId});

      var questions = this.session.get('questions');
      var question = questions.findWhere({id: questionId});
      var answers = this.session.get('answers');
      var answer = answers.findWhere({question: question.id});
      var notes = this.session.get('notes');

      this.interviewPage.addContent(new QuestionView({
        model: question,
        answer: answer,
        questions: questions,
        answers: answers,
        notes: notes
      }));
    },

    jobSpec: function () {
      var jobSpecId = this.session.get('jobPosition').get('job_specification');
      this.renderDocumentPage(jobSpecId);
    },

    cv: function () {
      var cvId = this.session.get('candidate').get('cv');
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
     if(!this.interviewPage) {
       this.interviewPage = new InterviewPage();
       this.renderPage(this.interviewPage);
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