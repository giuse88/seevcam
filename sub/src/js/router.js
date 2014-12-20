define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var QuestionsPage = require('pages/questionsPage');
  var DocumentPage = require('pages/documentPage');
  var File = require('models/file');

  return Backbone.Router.extend({
    routes: {
      'interview/questions': 'questions',
      'interview/jobSpec': 'jobSpec',
      'interview/cv': 'cv',
      'interview': 'interview',
      'review': 'review'
    },

    initialize: function () {
      this.$container = $('.main-content');
    },

    interview: function () {
      this.navigate('interview/questions', {trigger: true});
    },

    questions: function () {
      this.renderPage(new QuestionsPage());
    },

    jobSpec: function () {
      var session = require('services/session');
      var jobSpecId = session.get('jobPosition').get('job_spec');
      this.renderDocumentPage(jobSpecId);
    },

    cv: function () {
      var session = require('services/session');
      var cvId = session.get('candidate').get('cv');
      this.renderDocumentPage(cvId);
    },

    review: function () {
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