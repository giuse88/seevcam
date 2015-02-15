define(function(require){

  var Backbone = require("backbone");
  var Catalogue = require("models/catalogue");

  return  Backbone.Collection.extend({
    model: Catalogue,
    url: "/dashboard/questions/catalogue/",

    comparator: function(model){
        return model.get("catalogue_name");
    }

  });

});