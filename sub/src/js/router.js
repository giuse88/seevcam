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
      var session = require('session');
      var jobSpecId = session.get('jobPosition').get('job_spec');
      var jobSpec = new File({id: jobSpecId});
      var self = this;

      jobSpec.fetch()
        .done(function () {
          self.renderPage(new DocumentPage({model: jobSpec}));
        });
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
    }
  });
});