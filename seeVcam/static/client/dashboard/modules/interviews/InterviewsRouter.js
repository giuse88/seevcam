define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");

  return  Backbone.Router.extend({
    routes: {
      "interviews(/)": "interviews"
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
      $("#container").html("Interviews");
    }

  });

});