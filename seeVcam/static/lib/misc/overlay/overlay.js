define(function (require) {

  var Backbone = require("backbone");

  /* this should be a bit more configurable */

  return  Backbone.View.extend({

    tagName : "div",
    className : "overlay",

    template : function () {
      return "<div class='loading'> <div class='caption'> Saving ... </div> </div>";
    },

    initialize : function(options) {
      this.options = options;
    },

    render : function () {
      this.$el.html(this.template);
      return this;
    }

  });

});
