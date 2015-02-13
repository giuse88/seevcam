define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");
  var LoadingBar = require("nanobar");
  var Notification = require("notification");
  var Loader = require("services/http/Loader");
  var Catalogues = require("collections/catalogues");
  var CataloguesView = require("./views/catalogues");

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

      var self = this;
      Utils.updateActiveLink(this.navbarElement);
      LoadingBar.go(30);

      $.when(Loader.loadCatalogues()).then(function(){
        LoadingBar.go(100);

        // lazy load questions
        Loader.fetchQuestions(window.cache.catalogues);

        var catalogueView = new CataloguesView({
          collection:window.cache.catalogues,
          routing : true
          });
        Utils.safelyUpdateCurrentView(catalogueView);
        $("#container").html(catalogueView.render().$el);

      });

    },

    openCatalogue: function(catalogueId) {
      console.log("Router : open catalogue");

      var self= this;
      Utils.updateActiveLink(this.navbarElement);
      LoadingBar.go(30);

      $.when(Loader.loadCatalogues()).then(function() {
        LoadingBar.go(50);
        var catalogue = window.cache.catalogues.get(catalogueId);
        if (catalogue) {
            catalogue.fetchQuestions(function () {
              // success
              var catalogueView = new CataloguesView({
                collection:window.cache.catalogues,
                routing : true,
                catalogue : catalogueId
              });

              Utils.safelyUpdateCurrentView(catalogueView);
              $("#container").html(catalogueView.render().$el);
              // open catalogue
              LoadingBar.go(100);
              catalogueView.afterRender();
              // lazy load questions
              Loader.fetchQuestions(window.cache.catalogues);
          });
        } else {
          console.err("Catalogue not found");
          // TODO redirect to 404
        }
      });
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

    if (window.cache && window.cache.catalogues) {
      fetchSuccess(window.cache.catalogues);
      return;
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