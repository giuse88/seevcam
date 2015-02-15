define(function(require){

  var Question = require("models/question");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({

    model: Question,

    initialize: function (models, options) {
      // find a better solution
      if (options.catalogue) {
        this.catalogueId = options.catalogue.get('id');
        this.catalogue = options.catalogue;
      } else {
        this.catalogueId = options.catalogueId;
      }
      this.url = "/dashboard/questions/catalogue/" + this.catalogueId + "/list/";
    }

  });

});