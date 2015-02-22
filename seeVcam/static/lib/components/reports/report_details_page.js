/**
 * Created by giuseppe on 16/02/15.
 */
define(function (require) {

  require("circliful");
  var Moment = require('moment');
  var BaseView = require('baseView');
  var ReviewItemListView = require("components/review_item_list/reviewItemListView");
  var DocumentView = require("components/document_viewer/documentView");
  var File = require("models/file");
  var Timeline = require("components/timeline/timeline");

  return BaseView.extend({
    className : "report-page",
    template : require("text!./templates/report_details_page.html"),

    events : {
      "click .tab" : "handleClick"
    },

    initialize : function (options) {
      this.subViewsRenders = {
        answers : this.renderAnswers,
        cv : this.renderCV,
        "job-description" : this.renderJobSpec,
        history : this.renderTimeline
      };
      BaseView.prototype.initialize.apply(this, arguments);
    },

    handleClick : function (event) {
      this.$el.find(".tab-title.active").removeClass("active");
      var link  = $(event.target).data("link");
      $(event.target).addClass("active");
      var render = this.subViewsRenders[link];
      render && render.call(this);
    },

    postRender: function() {
      this.renderScore();
      this.renderOverallRating();
    },

    renderScore : function () {
      this.$el.find(".result-circle").circliful();
    },

    renderOverallRating : function () {
      this.$el.find('progress').each(function() {
        var max = $(this).val();
        $(this).val(0).animate({ value: max }, { duration: 2000, easing: 'easeOutCirc' });
      });
    },

    getRenderContext: function () {
      var interview = this.options.interview;
      return {
        candidateFullName : interview.get("candidate.name") + " " + interview.get("candidate.surname"),
        candidateEmail : interview.get("candidate.email"),
        interviewDate : this.formatDate(interview.get("start")),
        jobSpecification : this.options.jobSpecification,
        ratings : this.options.ratings
      }
    },

    renderAnswers: function () {
      var answers = this.options.answers;
      var questions = this.options.questions;
      this.updateSubView(new ReviewItemListView({collection:answers, questions: questions}));
    },

    updateSubView : function (view) {
      this.currentSubView && this.detachSubView(this.currentSubView);
      this.currentSubView = view;
      this.attachSubView('.report-inner-container', this.currentSubView);
    },

    renderCV : function () {
      this.renderFile(this.options.interview.get("candidate.cv"));
    },

    renderJobSpec : function () {
      this.renderFile(this.options.jobSpecification.id);
    },

    renderTimeline : function () {
      this.updateSubView(new Timeline({collection: this.options.events}));
    },

    renderFile : function (id) {
      // this shouldn't be here
      var self = this;
      var documentFile = new File({id:id});
          documentFile
            .fetch()
            .done(function () {
              self.updateSubView(new DocumentView({model: documentFile}));
            });
    },

    formatDate : function (date) {
      return new Moment(date).format("LLL");
    }
  });
});
