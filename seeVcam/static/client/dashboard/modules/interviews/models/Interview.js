define(function(require) {

  require("deep-model");
  var Backbone = require("backbone");
  var Questions = require("modules/questions/models/Questions");

  return Backbone.DeepModel.extend({

    getCandidateFullName : function () {
      return this.get("candidate.name") + " " + this.get("candidate.surname");
    }

  });

});
