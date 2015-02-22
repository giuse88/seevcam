define(function (require) {

  var BaseView = require('baseView');
  var Moment = require("moment");

  return BaseView.extend({
    template: require('text!./templates/timeline_event.html'),
    className : "cd-timeline-block",

    initialize : function (options) {
      this.options = options;
    },

    getRenderContext : function (){
      return {
        time : this.getRelativeTime()
      };
    },

    getRelativeTime : function () {
      var interviewStart = new Moment(this.options.interview.get("start"));
      var eventInstant = new Moment(this.model.get("timestamp"))
      return Moment(eventInstant.diff(interviewStart)).format("m[m] s[s]");
    }

  });
});
