define(function(require) {

  var Backbone = require("backbone");

  var QuestionsRouter = require("components/questions/question_router");
  var InterviewsRouter = require("components/interviews/interview_router");
  var ReportsRouter = require("components/reports/report_router");

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
