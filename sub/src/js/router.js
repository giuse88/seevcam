define(function (require) {
  var Backbone = require('backbone');
  var _ = require('underscore');
  var QuestionsPage = require('pages/questionsPage');

  return Backbone.Router.extend({
    routes: {
      'interview/questions': 'questions',
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