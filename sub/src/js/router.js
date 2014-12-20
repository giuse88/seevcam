define(["backbone", "underscore", "pages/interviewPage"], function (Backbone, _, InterviewPage) {
  return Backbone.Router.extend({
    routes: {
      'interview(/:type)': 'interview',
      'review': 'review'
    },

    initialize: function () {
      this.$container = $('.main-content');
    },

    interview: function (resource) {
      if (_.isEmpty(resource)) {
        this.navigate('interview/questions', {trigger: true});
        return;
      }

      this.renderPage(new InterviewPage())
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