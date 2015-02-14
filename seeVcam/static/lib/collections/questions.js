define(function(require){

  var Question = require("models/question");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({

    model: Question,

    initialize: function (models, options) {
      this.catalogue = options.catalogue;
      this.url = "/dashboard/questions/catalogue/" + this.catalogue.get('id') + "/list/";
    }

  });

});