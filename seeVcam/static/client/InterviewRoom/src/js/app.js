define(function (require) {

  var moment = require('moment');
  var Router = require('client/InterviewRoom/src/js/router');
  var Backbone = require('backbone');
  var Interview = require('models/interview');
  var JobPosition = require('models/jobPosition');
  var Candidate = require('models/candidate');
  var Questions = require('collections/questions');
  var Events = require('collections/events');
  var Answers = require('collections/answers');
  var Notes = require('models/notes');
  var OverallRatings = require('collections/overallRatings');
  var VideoSession = require('models/seevcamSession');

  var session = require('services/session');

  var interviewId = window.cache.interview.id;
  session.set('interview', new Interview(window.cache.interview));
  session.set('questions', new Questions(window.cache.questions, {catalogueId: session.get('interview').get('catalogue')}));
  session.set('answers', new Answers([], {interviewId: interviewId}));
  session.set('jobPosition', new JobPosition(window.cache.jobPosition));
  session.set('candidate', new Candidate(window.cache.interview.candidate));
  session.set('events', new Events([], {interviewId: interviewId}));
  session.set('notes', new Notes({}, {interviewId: interviewId}));
  session.set('overallRatings', new OverallRatings(window.cache.overallRatings, {interviewId: interviewId}));
  session.set('role', window.CONSTANTS.role);
  session.set('videoSession', new VideoSession({ token : window.CONSTANTS.token,
                                                 apiKey : window.CONSTANTS.apiKey,
                                                 sessionId : window.CONSTANTS.sessionId,
                                                 role : window.CONSTANTS.role
                                              }));

  require('services/mocks'); // TODO: Remove mocks

  window.router = new Router();
  Backbone.history.start({pushState: true, root : "/" });

  console.log("Role : " + session.get("role"));
  var $ = require('jquery');

  $.when(
    session.get('answers').fetch(),
    session.get('events').fetch(),
    session.get('notes').fetch()
    )
    .done(function () {
      console.log("Router");
      ensureQuestionsHaveCorrespondingAnswer();
    })
    .fail(function (resp) {
      $('.main-content').html('<h1>Cannot initiate session because server responded with ' + resp.status + '</h1>')
    });

  function ensureQuestionsHaveCorrespondingAnswer() {
    var answers = session.get('answers');
    var questions = session.get('questions');

    questions.each(function (question) {
      if (!answers.any({question: question.id})) {
        answers.add({question: question.id});
      }
    });
  }
});