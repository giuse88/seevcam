define(function(require){
  var Question = require("models/question");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({
    model: Question,

    url: function () {
      return "questions/catalogue/" + this.catalogueId + "/list/"
    },

    initialize: function (models, options) {
      this.catalogueId = options.catalogueId;
    }
  });
});