define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");
  var Catalogues = require("modules/questions/models/Catalogues");
  var CataloguesView = require("modules/questions/views/CataloguesView");

  return  Backbone.Router.extend({

    routes: {
      "questions(/)": "questions",
      "questions/:catalogueId(/)" : "openCatalogue"
    },

    initialize : function(){
      function navigator() {
        this.navigate("questions/", {trigger:true});
      }
      this.navbarElement = $('.navbar-nav *[data-route="questions"]');
      $('*[data-route="questions"]').click(navigator.bind(this));
    },

    questions: function () {
      if (!window.cache.catalogues){
        window.cache.catalogues = new Catalogues();
      }
      Utils.updateActiveLink(this.navbarElement);
      new CataloguesView({collection:window.cache.catalogues});
    },

    openCatalogue: function(catalogueId) {
      console.log("Router : open catalogue");
      debugger;
      if (!window.cache.catalogues){
        window.cache.catalogues = new Catalogues();
      }
      Utils.updateActiveLink(this.navbarElement);
      new CataloguesView({
        collection:window.cache.catalogues,
        catalogue : catalogueId
      });
    },

    goToCatalogue: function(id, trigger ){
     this.navigate("questions/" + id + "/", {trigger:!!trigger});
    }

  });

});