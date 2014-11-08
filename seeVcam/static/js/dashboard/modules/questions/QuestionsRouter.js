define(function(require){

  var Backbone = require("backbone");

  return  Backbone.Router.extend({

    routes: {
      "questions(/)": "questions",
      "questions/:catalogueId(/)" : "openCatalogue"
    },

    questions: function () {

      console.log("Select questions");
    },

    openCatalogue: function(catalogueId) {
      console.log("Open catalogue id : " + catalogueId);
    }

  });

});