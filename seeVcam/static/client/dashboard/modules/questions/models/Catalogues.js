define(function(require){

  var Backbone = require("backbone");
  var Catalogue = require("modules/questions/models/Catalogue");
  var notification = require("notification");

  return  Backbone.Collection.extend({
        model: Catalogue,
        url: "/dashboard/questions/catalogue/",

        initialize: function (catalogues) {

           
        }

    });

});