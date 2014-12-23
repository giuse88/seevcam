/**
 *
 * Created by giuseppe on 23/12/14.
 */

define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var createFormTemplate = require("text!modules/interviews/templates/createJobPosition.html");

 return Backbone.View.extend({
    className : "job-position-create-container",
    template: _.template(createFormTemplate),

    render: function() {
      this.$el.html(this.template);
      return this;
    }
  });

});

