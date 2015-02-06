define(function (require) {

  var Backbone = require("backbone");
  var $ = require("jquery");
  var Utils = require("utils");
  var InterviewApp = require("modules/interviews/views/InterviewAppView");
  var LoadingBar = require("nanobar");
  var Loader = require("modules/http/Loader");

  return  Backbone.Router.extend({

    routes: {
      "reports(/)": "reportPage",
      "reports/:interviewId(/)": "reportDetails"
    },

    initialize: function () {
      function navigator() {
        console.log("Going to report page");
        this.navigate("/reports/", {trigger: true});
      }
      this.navbarElement = $('.navbar-nav *[data-route="reports"]');
      this.navbarElement.click(navigator.bind(this));
      console.log("Reports router installed.");
    },

    reportPage : function ( ) {
      console.log("Report page");
      Utils.updateActiveLink(this.navbarElement);

      LoadingBar.go(40);
      $.when(Loader.loadJobPositions(), Loader.loadInterviews())
        .then(function() {
          LoadingBar.go(100);

          var interviewsApp = new InterviewApp({
            interviews: window.cache.interviews,
            activeClock: false
          });

          Utils.safelyUpdateCurrentView(interviewsApp);
          $("#container").html(interviewsApp.render().$el);
          // default inner view
          interviewsApp.renderInterviewBlock();

        });
    }

  });
});
