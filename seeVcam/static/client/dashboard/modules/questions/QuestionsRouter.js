define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");
  var Catalogues = require("modules/questions/models/Catalogues");
  var CataloguesView = require("modules/questions/views/CataloguesView");
  var LoadingBar = require("nanobar");
  var Notification = require("notification");

  return  Backbone.Router.extend({

    routes: {
      "questions(/)": "questions",
      "questions/:catalogueId(/)" : "openCatalogue"
    },

    initialize : function(){
      function navigator() {
        console.log("going to questions");
        this.navigate("/questions/", {trigger:true});
      }
      this.navbarElement = $('.navbar-nav *[data-route="questions"]');
      this.navbarElement.click(navigator.bind(this));
      console.log("Questions router installed.");
    },

    questions: function () {
      if (!window.cache.catalogues){
        LoadingBar.go(40);
        this.loadCatalogues(true, _.bind(function(){
          LoadingBar.go(100);
          this.questions();
          }, this));
        return;
      }
      Utils.updateActiveLink(this.navbarElement);
      var catalogueView = new CataloguesView({collection:window.cache.catalogues});
      Utils.safelyUpdateCurrentView(catalogueView);
      $("#container").html(catalogueView.render().$el);
    },

    openCatalogue: function(catalogueId) {
      console.log("Router : open catalogue");
      var self= this;
      if (!window.cache.catalogues){
        LoadingBar.go(40);
        this.loadCatalogues(true, _.bind(function(catalogues){
          var catalogue = catalogues.get(catalogueId);
          LoadingBar.go(80);
          if (catalogue) {
            catalogue.fetchQuestions(function(){
             LoadingBar.go(100);
             self.openCatalogue(catalogueId);
             });
           }else {
            console.err("Catalogue not found");
            // redirect to 404
          }
          }, this));
        return;
      }

      Utils.updateActiveLink(this.navbarElement);
      var catalogueView = new CataloguesView({
        collection:window.cache.catalogues,
        catalogue : catalogueId
      });
      Utils.safelyUpdateCurrentView(catalogueView);
      $("#container").html(catalogueView.render().$el);
      // open catalogue
      catalogueView.afterRender();
    },

    goToCatalogue: function(id, trigger ){
     this.navigate("questions/" + id + "/", {trigger:!!trigger});
    },

    goToQuestions: function( trigger ){
      this.navigate("questions/", {trigger:!!trigger});
    },

    loadCatalogues: function (lazyLoading, success, error) {

    function fetchFailure (model,response){
      var message = "Error fetching catalogues!";
      console.error(message);
      console.log(response.responseText);
      Notification.error(message, "Re-loading the page might fix this problem.");
      error && error(model, response);
    }

    function fetchSuccess(model, response){
      if (lazyLoading){
        model.each(function(catalogue){
          catalogue.fetchQuestions();
        });
      }
      success && success(model, response);
    }

    window.cache.catalogues = new Catalogues();
    window.cache.catalogues.fetch({
      reset: true,
      success: fetchSuccess,
      error: fetchFailure
    });

  }

  });

});