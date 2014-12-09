define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");
  var CreateInterview = require("modules/interviews/pjax_views/CreateInterview");
  var LoadingBar = require("nanobar");
  var Interviews = require("modules/interviews/models/InterviewList");
  var InterviewApp = require("modules/interviews/views/InterviewView");

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

      if (!window.cache.interviews){
        LoadingBar.go(40);
        this.loadInterviews(_.bind(function(){
          LoadingBar.go(100);
          this.interviews();
          }, this));
        return;
      }

      var interviewsApp = new InterviewApp({interviews : window.cache.interviews});
      Utils.safelyUpdateCurrentView(interviewsApp);
      $("#container").html(interviewsApp.render().$el);
      // default inner view
      interviewsApp.renderInterviewBlock();
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
    },


    loadInterviews: function (success, error) {

    function fetchFailure (model,response){
      var message = "Error fetching interviews!";
      console.error(message);
      console.log(response.responseText);
      Notification.error(message, "Re-loading the page might fix this problem.");
      error && error(model, response);
    }

    function fetchSuccess(model, response){
      success && success(model, response);
    }

    window.cache.interviews = new Interviews();
    window.cache.interviews.fetch({
      reset: true,
      success: fetchSuccess,
      error: fetchFailure
    });

  }


  });

});