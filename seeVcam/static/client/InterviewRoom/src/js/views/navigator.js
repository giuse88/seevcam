define(function (require) {

  var session = require('services/session');

  return {
    goToQuestions: function () {
      var questionId = session.get('questions').first().get('id');
      return this.goToQuestion(questionId);
    },
    goToQuestion: function (id) {
      window.router.navigate("interview/questions/" + id);
    },
    goToJobSpec: function () {
      window.router.navigate("interview/jobSpec/");
    },
    goToCv: function () {
      window.router.navigate("interview/cv/");
    },
    interviewGoTo : function (route) {
      if ( route === "questions") {
        return this.goToQuestions();
      }
      return window.router.navigate("interview/" + route);
    }
  }
});
