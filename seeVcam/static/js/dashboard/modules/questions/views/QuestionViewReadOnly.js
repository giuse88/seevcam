define(function (require) {

  var _ = require("underscore");
  var Backbone = require("backbone");
  var Utils = require("utils");

  return Backbone.View.extend({

      tagName: 'li',
      className: 'question',
      template: _.template( '<div class="question-read-only view form-group"> <p class="drag-dots"> :: </p> <p><%- question_text %></p></div>' ),
      helper_template: _.template( '<div class="question-drag-helper <%= color %>"> <p><%- question_text %></p></div>' ),

      id: function () {
       return this.model.get('id')
      },

      initialize: function () {
          _.bindAll(this, "dragHelper");
          this.listenTo(this.model, 'change', this.render);
          this.listenTo(this.model, 'destroy', this.remove);
          this.listenTo(this.model, 'error', Utils.syncError);
          this.listenTo(this.model, 'sync', Utils.syncSuccess);

      },

      render: function () {
          this.$el.html(this.template(this.model.toJSON()));
          this.$el.draggable({ cursor: 'move', containment: 'document', helper: this.dragHelper });
          return this;
      },

      dragHelper : function () {
          var scope = this.model.collection && this.model.collection.catalogue.get("catalogue_scope");
          var color = scope === "PRIVATE" ? "blue" : "red";
          return this.helper_template(_.extend(this.model.toJSON(), {color : color}));
      },

      deleteQuestion: function () {
          this.model.destroy();
          this.remove();
      },

      close: function () {
          this.remove();
          this.unbind();
          this.undelegateEvents();
      }

  });

});