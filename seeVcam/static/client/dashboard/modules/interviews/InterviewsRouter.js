define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");
  var CreateInterview = require("modules/interviews/pjax_views/CreateInterview");
  var LoadingBar = require("nanobar");

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
      LoadingBar.go(10);
      $.pjax({
        url: "interviews/pjax/",
        container: '#container',
        push: false,
        pjax_end: function () {
          LoadingBar.go(100);
          console.log("Installed interview page");
        }
      });
      Utils.safelyUpdateCurrentView();
    },

    createInterview: function() {
      console.log("Create interview route");
      Utils.updateActiveLink(this.navbarElement);
      Utils.safelyUpdateCurrentView();
      console.log(Backbone.history);

      // this happens when you load directly the interview page
      if (Backbone.history.fragment === "interviews/create/") {
        CreateInterview.installCreateInterview();
      } else {
        $.pjax({
          url: "interviews/create/",
          container: '#container',
          push: false,
          pjax_end: function () {
            CreateInterview.installCreateInterview();
          }
        });
      }
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