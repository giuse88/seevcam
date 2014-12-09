define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Calendar = require("modules/interviews/views/InterviewCalendarView");
  var InterviewBlocks = require("modules/interviews/views/BlocksView");

  return  Backbone.View.extend({

    tagName : 'div',
    className : 'interviews',
    attributes : {
      id : 'interviews'
    },

    events: {
      'click a.calendar' : 'renderInterviewCalendar',
      'click a.list'     : 'renderInterviewList',
      'click a.block'    : 'renderInterviewBlock'
    },

    template : _.template("" +
      '<div id="pending-interview" class="col-md-3"></div>'+
      '<div class="row upper-bar" id="interviews-upper-bar">'+
       '     <div id="searchbox-container" class="col-md-6 col-md-offset-3">'+
       '        <div class="search-interview-form">'+
        '            <input name="search" type="text" class="form-control search-input" placeholder="Search">'+
        '            <span class="search-icon"> <i class="glyphicon glyphicon-search"></i> </span>'+
         '       </div>'+
         '   </div>'+
         '   <div class="col-md-3 interview-view-type">'+
         '       <div class="tab-icons">'+
         '           <a class="glyphicon glyphicon-th block active" href="#interview-grid"></a>'+
         '           <a class="glyphicon glyphicon-align-justify list" href="#interview-list"></a>'+
         '           <a class="glyphicon glyphicon-calendar calendar" href="#interview-calendar" ></a>'+
         '       </div>'+
         '   </div>'+
        '</div>'+
        '<div class="row interviews-container">'+
        '    <div class="col-md-3" id="upcoming-interviews">'+
        '        <div class="interview-items">'+
        '                <p class="no-interview ">No interview scheduled for today.</p>'+
         '       </div>'+
         '   </div>'+
         '   <div id="interviews-view-container" class="col-md-8 interview-view-container"> Inner container </div>'+
        '</div>'),

    initialize : function (options){
      console.log("Initializing interview page");
      this.nestedView = null;
      this.interviews = options.interviews;
    },

    render : function(){
      this.$el.html(this.template);
      this.$interviewViewContainer = this.$el.find('.interview-view-container');
      this.$searchBox = this.$el.find('#searchbox-container input');
      console.log(this.$searchBox);
      this.$searchBox.bind('input propertychange', this.filterInterviews.bind(this));
      return this;
    },

    filterInterviews : function(e) {
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
      this.$el.find(".interview-view-type .list").addClass("active");
      this.$interviewViewContainer.html("List view");
      return this;
    },

    renderInterviewCalendar : function () {
      event && event.preventDefault();
      this.removeActiveClass();
      this.$el.find(".interview-view-type .calendar").addClass("active");
      var calendarView = new Calendar();
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

    renderTodayInterviews : function () {},
    renderOpenInterview : function () {},

    close: function (){
      this.closeNestedView();
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }

  });

});