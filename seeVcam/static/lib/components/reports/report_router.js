define(function (require) {

  var Backbone = require("backbone");
  var $ = require("jquery");
  var Utils = require("utils");
  var InterviewApp = require("components/interviews/views/interview_page");
  var LoadingBar = require("nanobar");
  var Loader = require("services/loader");
  var ReportDetails = require("./report_details_page");

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
            interviews: window.cache.interviews.getReports(),
            activeClock: false,
            isInterview: false
          });

          Utils.safelyUpdateCurrentView(interviewsApp);
          $("#container").html(interviewsApp.render().$el);
          interviewsApp.renderInterviewBlock();

        });
    },

    reportDetails : function (interviewId) {

      $.when(Loader.loadJobPositions(), Loader.loadInterviews(), Loader.loadOverallRatings(interviewId))
        .then( function () {
          var ratings = window.cache.overallRatings[interviewId];
          var interview =  window.cache.interviews.findWhere({id:parseInt(interviewId)});
          var jobSpecification = window.cache.jobPositions.findWhere({id: interview.get("job_position")});
          var reportPageDetails = new ReportDetails({
            ratings : ratings,
            interview : interview,
            jobSpecification : jobSpecification
          });
          Utils.safelyUpdateCurrentView(reportPageDetails);
          $("#container").html(reportPageDetails.render().$el);
      });
    }

  });
});
