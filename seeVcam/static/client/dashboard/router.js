define(function(require) {

  var QuestionsRouter = require("modules/questions/QuestionsRouter");

  var QuestionsRouter = new QuestionsRouter();

  Backbone.history.start({
    pushState: true,
    root: "/dashboard"
  });

  console.log("Routing installed.");

  return {
    QuestionsRouter : QuestionsRouter
  }

});
