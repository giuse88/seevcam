define(function (require) {

  var session = require('services/session');

  return {

    goToQuestions: function () {
      var questionId = session.get('questions').first().get('id');
      return this.goToQuestion(questionId);
    },

    goToQuestion: function (id) {
      window.router.navigate("/questions/" + id, {trigger:true});
    },

    goToJobSpec: function () {
      window.router.navigate("/jobSpec/");
    },

    goToCv: function () {
      window.router.navigate("/cv/");
    },

    goToEndInterviewPage : function () {
      window.location = "/interviewCompleted"
    },

    goToFullVideoView : function () {
      window.router.navigate("/full-video/", {trigger: true});
    },

    goToGoodBye : function () {
      window.router.navigate("/end-video/", {trigger: true});
    },

    goToReview : function () {
      window.router.navigate("/review/", {trigger:true});
    },

    goToDashboard : function() {
      window.location = "/dashboard";
    },

    interviewGoTo : function (route) {
      if ( route === "questions") {
        return this.goToQuestions();
      }
      return window.router.navigate("/" + route, {trigger:true});
    }
  }
});
