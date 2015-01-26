define(function (require) {

  var router = window.router;
  var session = require('services/session');

  return {
    goToQuestions: function () {
      var questionId = session.get('questions').first().get('id');
      return this.goToQuestion(questionId);
    },
    goToQuestion: function (id) {
      router.navigate("interview/questions/" + id);
    },
    goToJobSpec: function () {
      router.navigate("interview/jobSpec/");
    },
    goToCv: function () {
      router.navigate("interview/cv/");
    },
    interviewGoTo : function (route) {
      if ( route == "questions") {
        return this.goToQuestions();
      }
      return router.navigate("interview/" + route);
    }
  }
});
