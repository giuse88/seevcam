define(function (require) {

  var Backbone = require("backbone");

  return Backbone.Model.extend({

    initialize: function (options) {
      this.set('id', options.id);
    },

    url : function() {
      return  "/dashboard/files/" + this.get('id') + "/";
    }

  });

});
