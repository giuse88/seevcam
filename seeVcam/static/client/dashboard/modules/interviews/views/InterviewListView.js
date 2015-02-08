define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var InterviewBlock = require("modules/interviews/views/InterviewView");
	var NoInterviewTemplate = require("text!modules/interviews/templates/noInterview.html")


	return  Backbone.View.extend({

    tagName :'div',

    className :  function () {
      console.log(this.options);
      console.log("fff");
    },

    template_no_interview : _.template(NoInterviewTemplate),

    initialize : function(options){
      console.log("initializing block view");

      this.options = options || {};
      this.collection= options.collection;
      this.views = [];

      this.listenTo(this.collection, 'add', this.render);
      this.listenTo(this.collection, 'reset', this.render);
      this.listenTo(this.collection, 'error', Utils.syncError);
      this.listenTo(this.collection, 'sync', Utils.syncSuccess);
    },

    renderInterview : function(interview, index) {

      var interview = new InterviewBlock({
        model: interview,
        today: this.options.today,
        list : !!this.options.list
      });
      this.views.push(interview);

      var interviewRendered = interview.render().$el;
      if ((index%3) === 0 ) {
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
      _.each(this.views, function (view) {
        view.close();
      });
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }

  });

});
