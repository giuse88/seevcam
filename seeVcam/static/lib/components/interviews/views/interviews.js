define(function (require) {

  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
  var Interview = require("./interview");
  var NoInterviewTemplate = require("text!../templates/noInterview.html");
  var elementsContainer = require("text!../templates/elementsContainer.html");

	return  Backbone.View.extend({

    template_no_interview : _.template(NoInterviewTemplate),
		template : _.template(elementsContainer),

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

      var interview = new Interview({
        model: interview,
        today: this.options.today,
        isInterview : this.options.isInterview,
				mode: this.options.mode
      });
			console.log(this.options.isInterview);
      this.views.push(interview);

      var interviewRendered = interview.render().$el;
      this.$elements.append(interviewRendered);
    },

    setCollection : function ( collection ) {
      this.collection = collection;
    },

    renderAllInterviews : function () {
      this.collection.each(this.renderInterview, this);
    },

    render : function () {

			this.$el.html(this.template(this.getTemplateData()));
			this.$elements = this.$el.find(".elements-container");

      if (this.collection.length === 0)
        this.$elements.append(this.template_no_interview({
					today : this.options.today
				}));
      else
        this.renderAllInterviews();

      return this;
    },

		getTemplateData: function () {
			return this.options;
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
