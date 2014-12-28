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
  var Loader = require("modules/http/Loader");
  var Catalogues = require("modules/questions/models/Catalogues");

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
            interviews: window.cache.interviews,
            activeClock: false
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