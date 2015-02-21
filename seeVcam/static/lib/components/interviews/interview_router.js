define(function(require){

  var $ = require("jquery");
  var Utils = require("utils");
  var Backbone = require("backbone");
  var LoadingBar = require("nanobar");

  var Interviews = require("collections/interviews");

  var InterviewApp = require("./views/interview_page");
  var CreateInterviewView = require("./views/create_interview_page");

  var Loader = require("services/loader");

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
      this.createInterview = $('.navbar-nav .btn-create');
      this.createInterview.click(this.goToCreateInterview.bind(this,true));
      this.navbarElement.click(navigator.bind(this));
      console.log("Interiview router installed.");
    },

    /*
        Interview page
     */

    interviews: function () {
      console.log("Interviews route");
      Utils.updateActiveLink(this.navbarElement);

      LoadingBar.go(40);
      $.when(Loader.loadJobPositions(), Loader.loadInterviews())
        .then(function() {
          LoadingBar.go(100);

          var interviewsApp = new InterviewApp({
            interviews: window.cache.interviews.getInterviews(),
            activeClock: false,
            isInterview : true
          });

          Utils.safelyUpdateCurrentView(interviewsApp);
          $("#container").html(interviewsApp.render().$el);
          // default inner view
          interviewsApp.renderInterviewBlock();

        });
    },

    createInterview: function() {
      var self= this;
      console.log("Create interview route");

      Utils.updateActiveLink();

      LoadingBar.go(30);

      $.when(Loader.loadCatalogues(), Loader.loadJobPositions(), Loader.loadInterviews())
        .then(function() {

          LoadingBar.go(100);

          var createInterview = new CreateInterviewView({
            router: self,
            interviews: window.cache.interviews,
            catalogues : window.cache.catalogues,
            jobPositions : window.cache.jobPositions
          });

          Utils.safelyUpdateCurrentView(createInterview);
          $("#container").html(createInterview.render().$el);

          // lazy load questions
          Loader.fetchQuestions(window.cache.catalogues);
        });
    },


    updateInterview: function(interviewId) {
      console.log("Going to update interview");

      var self= this;

      Utils.updateActiveLink();
      LoadingBar.go(30);

      $.when(Loader.loadCatalogues(), Loader.loadJobPositions(), Loader.loadInterviews())
      .then(function(){
        LoadingBar.go(70);
        var interview  = window.cache.interviews.get(interviewId);

        if (!interview) {
          console.err("Interview not found");
          return;
        }
        var loadingFile = Loader.loadFile(interview.get("candidate.cv"));
        $.when(loadingFile)
          .then(function(file){

            interview.setCV(file);
            LoadingBar.go(100);

            var createInterview = new CreateInterviewView({
              router: self,
              interviews: window.cache.interviews,
              catalogues : window.cache.catalogues,
              jobPositions : window.cache.jobPositions,
              model : interview
            });

            Utils.safelyUpdateCurrentView(createInterview);
            $("#container").html(createInterview.render().$el);
            // lazy load questions
            Loader.fetchQuestions(window.cache.catalogues);
          });
      });
    },

    goToCreateInterview: function(trigger){
        this.navigate("/interviews/create/", {trigger:!!trigger});
    },

    goToInterview:function(id, trigger) {
       this.navigate("/interviews/" + id + "/", {trigger:!!trigger});
    },

    goToReports: function(id, trigger) {
      this.navigate("/reports/" + id + "/", {trigger:!!trigger});
    },

    goToInterviews: function(trigger){
      this.navigate("/interviews/", {trigger:!!trigger});
    },

    goToInterviewRoom: function(url){
      console.log("Going to " + url);
      location.href = url;
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