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
      this.$el.find('#myStat').circliful();
    }
  });


});
