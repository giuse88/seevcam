define(function (require) {

  var $ = require("jquery");

  var Interviews = require("collections/interviews");
  var JobPositions = require("collections/job_positions");
  var Catalogues = require("collections/catalogues");
  var OverallRatings = require("collections/overall_ratings");
  var Notes = require("models/notes");
  var Answers = require("collections/answers");
  var Events = require("collections/events");

  return {

    load:function(url, cacheData) {
      var d = $.Deferred();
      $.get(url)
        .done(function(p){
          cacheData && cacheData(p);
          d.resolve(p);
        })
        .fail(d.reject);
      return d.promise();
    },

    loadCatalogues : function () {
      function cacheCatalogues(catalogues) {
        window.cache.catalogues = new Catalogues(catalogues);
      }
      return window.cache.catalogues || this.load("/dashboard/questions/catalogue", cacheCatalogues);
    },

    loadInterviews : function () {
      function cacheInterviews(interviews) {
        window.cache.interviews = new Interviews(interviews);
      }
      return window.cache.interviews || this.load("/dashboard/interviews/interviews", cacheInterviews);
    },

    loadAnswers : function (interviewId) {
      function cacheAnswers (answers) {
        window.cache.answers[interviewId] = new Answers(answers,{interviewId : interviewId});
      }
      return window.cache.answers[interviewId] ||
        this.load("/dashboard/interviews/interviews/" + interviewId + "/answers", cacheAnswers);
    },

    loadEvents : function (interviewId) {
      function cacheEvents (events) {
        window.cache.events[interviewId] = new Events(events,{interviewId : interviewId});
      }
      return window.cache.events[interviewId] ||
        this.load("/dashboard/interviews/" + interviewId + "/events", cacheEvents);
    },

    loadNotes : function (interviewId) {
      function cacheEvents (notes) {
        window.cache.events[interviewId] = new Notes(notes,{interviewId : interviewId});
      }
      return window.cache.notes[interviewId] ||
        this.load("/dashboard/interviews/" + interviewId + "/notes", cacheEvents);
    },

    loadJobPositions : function () {
      function cacheJobPositions(positions) {
        return window.cache.jobPositions = new JobPositions(positions);
      }
      return window.cache.jobPositions || this.load("/dashboard/interviews/jobPositions", cacheJobPositions);
    },

    loadFile : function (fileId) {
      return this.load("/dashboard/files/"+fileId +"/");
    },

    loadOverallRatings: function (interviewId) {
      function cacheOverallRating(overallRatings) {
        window.cache.overallRatings[interviewId] = new OverallRatings(overallRatings, {interviewId : interviewId});
      }
      return window.cache.overallRatings[interviewId] ||
        this.load("/dashboard/interviews/interviews/" + interviewId + "/overall_ratings", cacheOverallRating);
    },

    fetchQuestions: function(catalogues) {
      catalogues.each(function(catalogue){
        catalogue.fetchQuestions();
      });
    }

  };

});

