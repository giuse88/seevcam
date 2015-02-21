/**
 * Created by giuseppe on 16/02/15.
 */
define(function (require) {

  require("circliful");
  var Moment = require('moment');
  var BaseView = require('baseView');
  var ReviewItemListView = require("components/review_item_list/reviewItemListView");

  return BaseView.extend({
    className : "report-page",
    template : require("text!./templates/report_details_page.html"),

    initialization : function (options) {
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
      var subView = new ReviewItemListView({collection:answers, questions: questions});
      this.attachSubView('.report-inner-container', subView);
      console.log("Rendered answers");
    },

    formatDate : function (date) {
      return new Moment(date).format("LLL");
    }
  });
});
