define(function(require){
  var Answer = require("models/answer");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({
    model: Answer,

    url: function () {
      return '/dashboard/interviews/' + this.interviewId + '/answers';
    },

    initialize: function (models, options) {
      this.interviewId = options.interviewId;
    }
  });
});