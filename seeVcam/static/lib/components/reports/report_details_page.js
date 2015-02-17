/**
 * Created by giuseppe on 16/02/15.
 */
define(function (require) {

  require("circliful");
  var _ = require("underscore");
  var BaseView = require('baseView');

  return BaseView.extend({
    className : "report-page",
    template : require("text!./templates/report_details_page.html"),

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
    }
  });
});
