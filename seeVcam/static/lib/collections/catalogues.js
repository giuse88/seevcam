define(function(require){

  var Backbone = require("backbone");
  var Catalogue = require("models/catalogue");

  return  Backbone.Collection.extend({
    model: Catalogue,
    url: "/dashboard/questions/catalogue/"
  });

});