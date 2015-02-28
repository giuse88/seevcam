define(function (require) {

  var BaseView = require('baseView');
  var Moment = require("moment");
  var InterviewEvent = require("components/event/eventView");

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

    postRender : function () {
      var $eventContainer = this.$el.find(".interview-event");
      var interviewEvent = new InterviewEvent(this.options);
      $eventContainer.append(interviewEvent.render().$el);
    },

    getRelativeTime : function () {
      var interviewStart = new Moment(this.options.interview.get("start"));
      var eventInstant = new Moment(this.model.get("timestamp"))
      return Moment(eventInstant.diff(interviewStart)).format("m[m] s[s]");
    }

  });
});
