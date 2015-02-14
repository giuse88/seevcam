define(function(require){

  var Backbone = require("backbone");
  var JobPosition = require("models/job_position");

  return Backbone.Collection.extend({

      model: JobPosition,
      url: "/dashboard/interviews/jobPositions/",

      initialize: function (interviews) {

      }

    });

});