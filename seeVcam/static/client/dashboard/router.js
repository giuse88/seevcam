define(function(require) {

  var QuestionsRouter = require("modules/questions/QuestionsRouter");

  var questionsRouter = new QuestionsRouter();

  Backbone.history.start({
    pushState: true,
    root: "/dashboard"
  });

  console.log("Routing installed.");

  return {
    questionsRouter : questionsRouter
  }

});
