define(function (require) {

  var $ = require("jquery");
  var BaseView = require('baseView');
  var Event = require("./timeline_event");

  return BaseView.extend({
    template: require('text!./templates/timeline.html'),
    className : "timeline",

    initialize : function (options) {
      this.interviewEvents = options.interview_events;
      this.questions = options.questions;
      this.answers = options.answers;
      this.interview = options.interview;
    },

    postRender : function() {
      this.$timelineContainer = this.$el.find(".cd-container");
      this.renderEvents();
      this.addAnimation();
    },

    renderEvents : function () {
      var self = this;
      var answers = this.answers;
      var questions = this.questions;
      this.interviewEvents.each(function(event) {
        var event = new Event({model : event, interview: self.interview, answers : answers, questions: questions});
        self.$timelineContainer.append(event.render().$el);
      });
    },

    addAnimation : function () {
      var $timeline_block = this.$el.find('.cd-timeline-block');
      var self = this;

      $timeline_block.each(function(){
        if($(this).position().top > self.$el.height()) {
          $(this).find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
        }
      });

      this.$el.on('scroll', function(){
        $timeline_block.each(function(){
          if( $(this).position().top <= self.$el.scrollTop() + self.$el.height()*0.50 &&
              $(this).find('.cd-timeline-img').hasClass('is-hidden') ) {
            $(this).find('.cd-timeline-img, .cd-timeline-content').removeClass('is-hidden').addClass('bounce-in');
          }
        });
      });
    }
  });

});
