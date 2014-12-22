define(function (require) {

  var $ = require("jquery");

  var Interviews = require("modules/interviews/models/InterviewList");
  var Catalogues = require("modules/questions/models/Catalogues");
  var JobPosition = require("modules/interviews/models/JobPosition");

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
        window.cache.jobPositions = new JobPosition(positions);
      }
      return window.cache.jobPositions || this.load("/dashboard/interviews/jobPositions", cacheJobPositions);
    },

    loadFile : function (fileId) {
      return this.load("/dashboard/files/"+fileId +"/");
    }

  };

});

