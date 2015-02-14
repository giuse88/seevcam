define(function(require){

  var Question = require("models/question");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({

    model: Question,

    initialize: function (models, options) {
      if (options.catalogue) {
        this.catalogueId = options.catalogue.get('id');
      } else {
        this.catalogueId = options.catalogueId;
      }
      this.url = "/dashboard/questions/catalogue/" + this.catalogueId + "/list/";
    }

  });

});