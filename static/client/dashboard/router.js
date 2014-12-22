define(function(require) {

  var Backbone = require("backbone");
  var QuestionsRouter = require("modules/questions/QuestionsRouter");
  var InterviewsRouter = require("modules/interviews/InterviewsRouter");

  var QuestionsRouter = new QuestionsRouter();
  var InterviewsRouter = new InterviewsRouter();

  Backbone.history.start({
    pushState: true,
    root: "/dashboard"
  });

  console.log("Routing installed.");

  return {
    QuestionsRouter : QuestionsRouter,
    InterviewsRouter : InterviewsRouter
  }

});
