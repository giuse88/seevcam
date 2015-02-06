define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  var reportPageTemplate  = require("modules/reports/templates/interviewPage.html");

  return  Backbone.View.extend({

    tagName : 'div',
    className : 'reports',

    events: {
      'click a.list'     : 'renderInterviewList',
      'click a.block'    : 'renderInterviewBlock',
      'click .search-icon': 'filterInterviews'
    },

    defaults : {
     activeClock : false
    },

    template : _.template(reportPageTemplate),

    initialize : function (options){
    },

    render : function(){
      this.$el.html(this.template);
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