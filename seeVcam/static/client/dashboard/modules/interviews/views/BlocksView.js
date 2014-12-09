define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var InterviewBlock = require("modules/interviews/views/BlockView");

  return  Backbone.View.extend({

    tagName :'div',
    className : 'interview-grid',
    template_no_interview : '<div class="no-interview">No interview.</div>',

    initialize : function(options){
      this.collection= options.collection;

      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'remove', this.render);
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'error', Utils.syncError);
      this.listenTo(this.collection, 'sync', Utils.syncSuccess);
    },

    renderInterview : function(interview) {
      var interview = new InterviewBlock({model:interview});
      this.$el.append(interview.render().$el);
    },

    renderAllInterviews : function () {
      this.collection.each(this.renderInterview, this);
    },

    render : function () {
      if (this.collection.length === 0)
              this.$el.append(this.template_no_interview);
          else
             this.renderAllInterviews();
          return this;
      return this;
    }

  });

});
