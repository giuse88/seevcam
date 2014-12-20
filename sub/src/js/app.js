define(function (require) {
  var moment = require('moment');
  var Router = require('./router');
  var Backbone = require('backbone');
  var Interview = require('models/interview');
  var JobPosition = require('models/jobPosition');
  var Candidate = require('models/candidate');
  var Questions = require('collections/questions');
  var Events = require('collections/events');
  var Answers = require('collections/answers');

  var session = require('services/session');

  session.set('interview', new Interview(window.cache.interview));
  session.set('questions', new Questions(window.cache.questions, {catalogueId: session.get('interview').get('catalogue')}));
  session.set('answers', new Answers([], {interviewId: session.get('interview').get('id')}));
  session.set('jobPosition', new JobPosition(window.cache.jobPosition));
  session.set('candidate', new Candidate(window.cache.interview.candidate));
  session.set('events', new Events([], {interviewId: session.get('interview').get('id')}));
  session.set('sessionStart', moment.utc());

  require('services/mocks'); // TODO: Remove mocks

  new Router();
  Backbone.history.start();
});