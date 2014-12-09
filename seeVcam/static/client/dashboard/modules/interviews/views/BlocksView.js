define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var InterviewBlock = require("modules/interviews/views/BlockView");

  return  Backbone.View.extend({

    tagName :'div',
    className : 'interview-grid',
    template_no_interview : '<div class="no-interview text-shadow ">No interview</div>',

    initialize : function(options){
      this.collection= options.collection;

      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'error', Utils.syncError);
      this.listenTo(this.collection, 'sync', Utils.syncSuccess);
    },

    renderInterview : function(interview, index) {
      var interview = new InterviewBlock({model:interview});
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
      this.$el.empty();
      console.log("rendering");
      if (this.collection.length === 0)
              this.$el.append(this.template_no_interview);
          else
             this.renderAllInterviews();
          return this;
      return this;
    },

    close: function (){
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }

  });

});
