/**
 * Created by giuseppe on 16/02/15.
 */
define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var BaseView = require('baseView');

  return BaseView.extend({
    className : "report-page",
    template : require("text!./templates/report_details_page.html")
  });

});
