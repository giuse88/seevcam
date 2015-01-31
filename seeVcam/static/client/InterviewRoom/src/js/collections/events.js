define(function(require){
  var Event = require("models/event");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({
    model: Event,

    url: function () {
      return '/dashboard/interviews/' + this.interviewId + '/events';
    },

    initialize: function (models, options) {
      this.interviewId = options.interviewId;
    }
  });
});