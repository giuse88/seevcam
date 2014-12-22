define(function(require){

  var Backbone = require("backbone");
  var JobPosition = require("modules/interviews/models/JobPosition");

  return Backbone.Collection.extend({

      model: JobPosition,
      url: "/dashboard/interviews/jobPositions/",

      initialize: function (interviews) {

      }

    });

});