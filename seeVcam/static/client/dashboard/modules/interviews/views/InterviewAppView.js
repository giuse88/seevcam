define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Calendar = require("modules/interviews/views/InterviewCalendarView");
  var InterviewBlocks = require("modules/interviews/views/InterviewListView");
  var Interviews = require("modules/interviews/models/InterviewList");
  var InterviewView = require("modules/interviews/views/InterviewView");
  var ClockView = require("modules/interviews/views/ClockView");
	var InterviewsTemplate = require("text!modules/interviews/templates/interviews.html")

  return  Backbone.View.extend({

    tagName : 'div',
    className : 'interviews',
    attributes : {
      id : 'interviews'
    },

    events: {
      'click a.calendar' : 'renderInterviewCalendar',
      'click a.list'     : 'renderInterviewList',
      'click a.block'    : 'renderInterviewBlock',
      'click .search-icon': 'filterInterviews'
    },

    defaults : {
     activeClock : false
    },

    template :_.template(InterviewsTemplate),

    initialize : function (options){
      this.options = _.extend( this.defaults, options);
      this.nestedView = null;
      this.interviews = new Interviews(this.options.interviews.sortBy('start'));
    },

    render : function(){

      this.$el.html(this.template);
      this.$interviewViewContainer = this.$el.find('.interview-view-container');
      this.$searchBox = this.$el.find('#searchbox-container input');
      this.$todayInterview = this.$el.find(".upcoming-interviews");
      this.$openInterview = this.$el.find(".open-interview");
      // today
      this.renderOpenInterview();
      this.renderTodayInterviews();
      // clock
      if(this.options.activeClock)  {
        this.renderClock();
      }
      this.$searchBox.bind('input propertychange', this.filterInterviews.bind(this));
      return this;
    },

    renderClock : function () {
      this.clockView = new ClockView();
      this.$el.prepend(this.clockView.render().$el);
      return this;
    },

    filterInterviews : function(e) {
      console.log("Searching...");
      var $target = $(e.currentTarget);
      var currentValue = $target.val();
      this.nestedView.setCollection(this.interviews.filterByName(currentValue));
      this.$interviewViewContainer.html(this.nestedView.render().$el);
    },

    renderInterviewBlock : function (event) {
      event && event.preventDefault();
      this.removeActiveClass();
      var interviewView = new InterviewBlocks({ collection: this.interviews});
      this.updateNestedView(interviewView);
      this.$el.find(".interview-view-type .block").addClass("active");
      this.$interviewViewContainer.html(this.nestedView.render().$el);
      return this;
    },

    renderInterviewList : function () {
      event && event.preventDefault();
      this.removeActiveClass();
      var interviewView = new InterviewBlocks({
        collection: this.interviews,
        list : true
      });
      this.updateNestedView(interviewView);
      this.$el.find(".interview-view-type .list").addClass("active");
      this.$interviewViewContainer.html(this.nestedView.render().$el);
      return this;
    },

    renderInterviewCalendar : function () {
      event && event.preventDefault();
      this.removeActiveClass();
      this.$el.find(".interview-view-type .calendar").addClass("active");
      var calendarView = new Calendar({
        collection:window.cache.interviews,
        readOnly : true
      });
      this.updateNestedView(calendarView);
      this.$interviewViewContainer.html(this.nestedView.render().$el);
      return this;
    },

    removeActiveClass:function () {
      this.$el.find(".interview-view-type .active").removeClass("active");
    },

    closeNestedView: function () {
      if (this.nestedView && this.nestedView.close && _.isFunction(this.nestedView.close)) {
        this.nestedView.close();
      }
    },

    updateNestedView:function(newNestedView) {
      this.closeNestedView();
      this.nestedView = newNestedView;
    },

    renderTodayInterviews : function () {

      var todayInterviews = this.interviews.getTodayInterviews();
      var howManyInterviewToday = todayInterviews.length;

      if (todayInterviews.length > 3) {
        todayInterviews = todayInterviews.slice(0,2);
        howManyInterviewToday = 3;
      }

      for (var i=0; i< howManyInterviewToday; i++) {
        this.interviews.shift();
      }

      var interviewView = new InterviewBlocks({
        collection: new Interviews(todayInterviews),
        today: true
      });

      this.todayInterview = interviewView;
      this.$todayInterview.html(interviewView.render().$el);

      return this;
    },

    renderOpenInterview : function () {
      if ( this.interviews.first() && this.interviews.first().isOpen() )  {
        this.openInterviewModel = this.interviews.shift();
        this.openInterviewView = new InterviewView({ model : this.openInterviewModel });
        this.$openInterview.html(this.openInterviewView.render().$el);
      }
    },

    close: function (){
      this.closeNestedView();
      this.clockView && this.clockView.close();
      this.todayInterview && this.todayInterview.close();
      this.openInterview && this.openInterview.close();
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }

  });

});