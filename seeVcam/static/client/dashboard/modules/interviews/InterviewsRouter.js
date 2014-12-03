define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");
  var CreateInterview = require("modules/interviews/pjax_views/CreateInterview");

  return  Backbone.Router.extend({
    routes: {
      "interviews(/)": "interviews",
      "interviews/create(/)": "createInterview"
    },

    initialize: function () {
      function navigator() {
        this.navigate("/interviews/", {trigger: true});
        console.log("Going to interiviews");
      }
      this.navbarElement = $('.navbar-nav *[data-route="interviews"]');
      this.navbarElement.click(navigator.bind(this));
      console.log("Interiview router installed.");
    },

    interviews: function () {
      console.log("Interviews route");
      Utils.updateActiveLink(this.navbarElement);
      // this should use the interview view which hasn't be implemented yet.
      Utils.safelyUpdateCurrentView();
      $("#container").html("Interviews");
    },

    createInterview: function() {
      $(document).on('pjax:end', function() {
        CreateInterview.installCreateInterview();
      });
      console.log("Create interview route");
      Utils.updateActiveLink(this.navbarElement);
      Utils.safelyUpdateCurrentView();
      $.pjax({url: "interviews/create/", container: '#container', push:false});
    },

    goToCreateInterview: function(trigger){
        this.navigate("/interviews/create/", {trigger:!!trigger});
    },
    goToInterviews: function(trigger){
      console.log("fff");
      this.navigate("/interviews/", {trigger:!!trigger});
    }

  });

});