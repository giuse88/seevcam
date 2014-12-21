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
  var Notes = require('models/notes');

  var session = require('services/session');

  var interviewId = window.cache.interview.id;
  session.set('interview', new Interview());
  session.set('questions', new Questions(window.cache.questions, {catalogueId: session.get('interview').get('catalogue')}));
  session.set('answers', new Answers([], {interviewId: interviewId}));
  session.set('jobPosition', new JobPosition(window.cache.jobPosition));
  session.set('candidate', new Candidate(window.cache.interview.candidate));
  session.set('events', new Events([], {interviewId: interviewId}));
  session.set('notes', new Notes({}, {interviewId: interviewId}));
  session.set('sessionStart', moment.utc());

  require('services/mocks'); // TODO: Remove mocks

  var $ = require('jquery');

  $.when(
    session.get('answers').fetch()
    )
    .done(function () {
      new Router();
      Backbone.history.start();
    })
    .fail(function (resp) {
      $('.main-content').html('<h1>Cannot initiate session because server responded with ' + resp.status + '</h1>')
    });
});