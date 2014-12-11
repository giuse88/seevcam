define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var InterviewBlock = require("modules/interviews/views/InterviewView");

  return  Backbone.View.extend({

    tagName :'div',

    className :  function () {
      console.log(this.options);
      console.log("fff");
    },

    template_no_interview : function() {
      return '<div class="no-interview text-shadow ">No interview ' +(this.options.today ? "today" : "") + "</div>";
    },

    initialize : function(options){
      console.log("initializing block view");
      this.options = options || {};
      this.collection= options.collection;

      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'error', Utils.syncError);
      this.listenTo(this.collection, 'sync', Utils.syncSuccess);
    },

    renderInterview : function(interview, index) {

      // I should save the nested interviews so that I can safely remove them when this view is destroyed

      var interview = new InterviewBlock({
        model: interview,
        today: this.options.today,
        list : !!this.options.list
      });

      var interviewRendered = interview.render().$el;
      if ( index === 0 ) {
        interviewRendered.addClass('first');
      }
      this.$el.append(interviewRendered);

    },

    setCollection : function ( collection ) {
      this.collection = collection;
    },

    renderAllInterviews : function () {
      this.collection.each(this.renderInterview, this);
    },

    render : function () {
      // here because this.options is undefined when computing className, attributes..
      var mainContainerClass = this.options.list ? 'interviews-list-view' : 'interview-grid';
      this.$el.empty();
      console.log("rendering");
      if (this.collection.length === 0)
        this.$el.append(this.template_no_interview());
      else
        this.renderAllInterviews();
      this.$el.addClass(mainContainerClass);
      return this;
    },

    close: function (){
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }

  });

});
