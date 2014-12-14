define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");
  var CreateInterview = require("modules/interviews/pjax_views/CreateInterview");
  var LoadingBar = require("nanobar");
  var Interviews = require("modules/interviews/models/InterviewList");
  var InterviewApp = require("modules/interviews/views/InterviewAppView");
  var CreateInterviewView = require("modules/interviews/views/CreateInterviewView");
  var Interview = require("modules/interviews/models/Interview");
  var FileUploaded = require("modules/interviews/models/FileUploaded");

  return  Backbone.Router.extend({

    routes: {
      "interviews(/)": "interviews",
      "interviews/create(/)": "createInterview",
      "interviews/:interviewId(/)": "updateInterview"
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

    /*
        Interview page
     */

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

      var interviewsApp = new InterviewApp({
        interviews : window.cache.interviews,
        activeClock: false
      });

      Utils.safelyUpdateCurrentView(interviewsApp);
      $("#container").html(interviewsApp.render().$el);
      // default inner view
      interviewsApp.renderInterviewBlock();
    },

    /*
        Create page
     */

    createInterview: function() {
      console.log("Create interview route");

      Utils.updateActiveLink(this.navbarElement);

      // find a better way
      if (!window.cache.interviews){
        LoadingBar.go(40);
        this.loadInterviews(_.bind(function(){
          LoadingBar.go(100);
          this.createInterview();
          }, this));
        return;
      }

      var createInterview = new CreateInterviewView({
        router: this,
        interviews: window.cache.interviews
      });

      Utils.safelyUpdateCurrentView(createInterview);
      $("#container").html(createInterview.render().$el);
    },

    updateInterview: function(interviewId) {
      console.log("Going to update interview");

      var self= this;

      Utils.updateActiveLink(this.navbarElement);

      /*
          Resource to access this page
          - interviews
          - fileUpload
       */

      if (!window.cache.interviews){
        LoadingBar.go(20);
        this.loadInterviews(_.bind(function(){
          LoadingBar.go(50);
          this.updateInterview(interviewId);
        }, this));
        return;
      }

      var interview = window.cache.interviews.get(interviewId);

      if(interview) {
        if (!interview.isCVFetched()) {
          interview.fetchCV(function () {
            console.log("File fetched from remote server");
            self.updateInterview(interviewId);
          });
          return;
        } else {
          LoadingBar.go(100);
        }
      } else {
        console.log("Error redirect to 404");
        return;
      }

      var createInterview = new CreateInterviewView({
        router: this,
        interviews: window.cache.interviews,
        model : interview
      });

      Utils.safelyUpdateCurrentView(createInterview);
      $("#container").html(createInterview.render().$el);
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