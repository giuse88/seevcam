define(function(require) {

  var Backbone = require("backbone");
  var QuestionsRouter = require("modules/questions/QuestionsRouter");
  var InterviewsRouter = require("modules/interviews/InterviewsRouter");
  var ReportsRouter = require("modules/reports/reportRouter");

  var questionsRouter = new QuestionsRouter();
  var interviewsRouter = new InterviewsRouter();
  var reportsRouter = new ReportsRouter();

  Backbone.history.start({
    pushState: true,
    root: "/dashboard"
  });

  console.log("Routing installed.");

  return {
    QuestionsRouter : questionsRouter,
    InterviewsRouter : interviewsRouter,
    ReportRouter : reportsRouter
  }

});
