define(function(require){

  var Backbone = require("backbone");
  var Catalogues = require("modules/questions/models/Catalogues");
  var CataloguesView = require("modules/questions/views/CataloguesView");

  return  Backbone.Router.extend({

    routes: {
      "questions(/)": "questions",
      "questions/:catalogueId(/)" : "openCatalogue"
    },

    questions: function () {
      if (!window.cache.catalogueList){
        window.cache.catalogues = new Catalogues();
      }
      new CataloguesView(window.cache.catalogues);
    },

    openCatalogue: function(catalogueId) {
      console.log("Open catalogue id : " + catalogueId);
    }

  });

});