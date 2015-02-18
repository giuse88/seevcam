define(function (require) {

  var $ = require("jquery");

  var Interviews = require("collections/interviews");
  var JobPositions = require("collections/job_positions");
  var Catalogues = require("collections/catalogues");
  var OverallRatings = require("collections/overall_ratings");

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

    loadJobPositions : function () {
      function cacheJobPositions(positions) {
        window.cache.jobPositions = new JobPositions(positions);
      }
      return window.cache.jobPositions || this.load("/dashboard/interviews/jobPositions", cacheJobPositions);
    },

    loadFile : function (fileId) {
      return this.load("/dashboard/files/"+fileId +"/");
    },

    loadOverallRatings : function (interviewId) {
      function cacheOverallRating(overallRatings) {
        window.cache.overallRatings[interviewId] = new OverallRatings(overallRatings, {interviewId : interviewId});
      }
      return window.cache.overallRatings[interviewId] ||
        this.load("/dashboard/interviews/interviews/" + interviewId +"/overall_ratings", cacheOverallRating);
    },

    fetchQuestions: function(catalogues) {
      catalogues.each(function(catalogue){
        catalogue.fetchQuestions();
      });
    }

  };

});

