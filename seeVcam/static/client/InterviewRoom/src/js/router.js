define(function (require) {

  var Backbone = require('backbone');
  var QuestionView = require("views/interview/questionView");
  var DocumentView = require('views/controls/documentView');
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

    fullVideo: function () {
      console.log("full video");
      this.renderPage(new FullVideoPage({model: this.session}));
    },

    // =================== Inner view ====================//

    questions: function (questionId) {
      var self = this;

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
      console.log(" --------------- Job spec ------------------");
      var self = this;

      this.fetch().then(function () {

        self.initializeInterviewPage();

        var jobSpecId = self.session.get('jobPosition').get('job_specification');
        var documentFile = new File({id: jobSpecId});
        documentFile.fetch()
        .done(function () {
          self.interviewPage.addContent( new DocumentView({model: documentFile}));
        });
      });
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

    initializeInterviewPage: function () {
      if (!this.interviewPage) {
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