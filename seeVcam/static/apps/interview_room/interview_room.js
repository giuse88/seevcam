define(function (require) {

  var $ = require('jquery');
  var moment = require('moment');
  var Router = require('./router');
  var Backbone = require('backbone');
  var Notes = require('models/notes');
  var session = require('services/session');
  var Events = require('collections/events');
  var Candidate = require('models/candidate');
  var Interview = require('models/interview');
  var Answers = require('collections/answers');
  var JobPosition = require('models/job_position');
  var Questions = require('collections/questions');
  var VideoSession = require('models/seevcam_session');
  var OverallRatings = require('collections/overall_ratings');

  var interviewId = window.cache.interview.id;

  $.ajaxSetup({
    headers: { "X-CSRFToken": window.CONSTANTS.csrft_token}
  });

  /*
      Session initialization
   */
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
  console.log("Role : " + session.get("role"));

  var roleCode = session.get("role") === "interviewer" ? 0 :1;
  var baseRootUrl = "/interview/" + roleCode +"/" + interviewId + "/";
  console.log(baseRootUrl);

  /*
    Router
   */
  window.router = new Router();
  Backbone.history.start({pushState: true, root : baseRootUrl });


});