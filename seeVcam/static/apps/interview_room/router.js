define(function (require) {

  var Backbone = require('backbone');
  var QuestionView = require("components/interview_room/interview/questionView");
  var DocumentView = require('components/document_viewer/documentView');
  var ReviewPage = require('components/interview_room/review/reviewPage');
  var PresencePage = require('components/interview_room/presence/presencePage');
  var FullVideoPage = require("components/interview_room/presence/fullVideoPage");
  var InterviewPage = require("components/interview_room/interview/interviewPage");
  var File = require('models/file');

  return Backbone.Router.extend({

    routes: {

      'job-spec(/)': 'jobSpec',
      'cv(/)': 'cv',
      'full-video(/)': 'fullVideo',
      'end-video(/)' : 'endVideo',
      'goodbye' : 'fullVideo',
      'questions(/)(:questionId)': 'questions',

      '(:token)' : 'presence',
      '': 'presence',
      'interviewee(/)': 'interview',
      'review(/)': 'review'
    },

    initialize: function () {
      this.$container = $('.main-content');
      this.session = require('services/session');
      console.log("Router initialized");
    },

    presence: function () {
      console.log("interview");
      this.renderPage(new PresencePage({model: this.session}));
    },

    fullVideo: function () {
      console.log("full video");
      this.renderPage(new FullVideoPage({model: this.session, isGoodByePage:false}));
    },

    endVideo: function () {
      console.log("end video");
      this.renderPage(new FullVideoPage({model: this.session, isGoodByePage:true}));
    },

    // =================== Inner view ====================//

    questions: function (questionId) {
      var self = this;

      console.log("questions");
      this.fetch().then(function () {

        self.initializeInterviewPage();

        questionId = parseInt(questionId) || self.session.get('questions').first().get('id');

        var eventLogger = require('services/eventLogger');
        eventLogger.log(eventLogger.eventType.QUESTION_SELECTED, {question_id: questionId});

        var questions = self.session.get('questions');
        var question = questions.findWhere({id: questionId});
        var answers = self.session.get('answers');
        var answer = answers.findWhere({question: question.id});
        var notes = self.session.get('notes');

        self.interviewPage.addContent(new QuestionView({
          model: question,
          answer: answer,
          questions: questions,
          answers: answers,
          notes: notes
        }));

      });
    },

    jobSpec: function () {
      var jobSpecId = this.session.get('jobPosition').get('job_description');
      this.renderDocumentView(jobSpecId);
    },

    cv: function () {
      var cvId = this.session.get('candidate').get('cv');
      this.renderDocumentView(cvId);
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

    initializeInterviewPage: function () {
      if (!this.interviewPage) {
        this.interviewPage = new InterviewPage();
        this.renderPage(this.interviewPage);
      }
    },

    renderDocumentView: function (documentId) {
      var self =this;
      this.fetch().then(function () {
        self.initializeInterviewPage();
        var documentFile = new File({id: documentId});
        documentFile.fetch()
          .done(function () {
            self.interviewPage.addContent( new DocumentView({model: documentFile}));
          });
      });
    },

    fetch: function () {
      var self = this;
      var d = $.Deferred();

      if (this.fetched )  {
        return d.resolve(true);
      }

      return $.when(
        this.session.get('answers').fetch(),
        this.session.get('events').fetch(),
        this.session.get('notes').fetch())
        .done(function () {
          self.fetched = true;
          self.ensureQuestionsHaveCorrespondingAnswer();
        })
        .fail(function (resp) {
          $('.main-content').html('<h1>Cannot initiate session because server responded with ' + resp.status + '</h1>')
        });
    },

    ensureQuestionsHaveCorrespondingAnswer: function () {
      var answers = this.session.get('answers');
      var questions = this.session.get('questions');

      questions.each(function (question) {
        if (!answers.any({question: question.id})) {
          answers.add({question: question.id});
        }
      });
    }
  });
});