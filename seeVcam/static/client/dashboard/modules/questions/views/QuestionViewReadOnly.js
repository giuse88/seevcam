define(function (require) {

  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");
	var QuestionReadOnly = require("text!modules/questions/templates/questionReadOnly.html")
	var QuestionReadOnlyHelper = require("text!modules/questions/templates/QuestionReadOnlyHelper.html")

  return Backbone.View.extend({

      tagName: 'li',
      className: 'question',
      template: _.template(QuestionReadOnly),
      helper_template: _.template(QuestionReadOnlyHelper),

      id: function () {
       return this.model.get('id')
      },

      initialize: function () {
        _.bindAll(this, "dragHelper");
        _.bindAll(this, "close");
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'destroy', this.close);
        this.listenTo(this.model, 'error', Utils.syncError);
        this.listenTo(this.model, 'sync', Utils.syncSuccess);

      },

      render: function () {
          this.$el.html(this.template(this.model.toJSON()));
          // this doesn't work on Firefox
          this.$el.draggable(
            { cursor: '-webkit-grabbing',
              containment: 'document',
              helper: this.dragHelper ,
              cursorAt : {left:10}
            });
          return this;
      },

      dragHelper : function () {
          var scope = this.model.collection && this.model.collection.catalogue.get("catalogue_scope");
          var color = scope === "PRIVATE" ? "blue" : "red";
          return this.helper_template(_.extend(this.model.toJSON(), {color : color}));
      },

      close: function () {
        console.log("Killing ", this);
        this.remove();
        this.unbind();
        this.undelegateEvents();
      }

  });

});