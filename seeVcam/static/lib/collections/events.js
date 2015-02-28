define(function(require){
  var Event = require("models/event");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({
    model: Event,

    comparator: function(event) {
      return +new Date(event.get("timestamp")).getTime();
    },

    url: function () {
      return '/dashboard/interviews/' + this.interviewId + '/events/';
    },

    initialize: function (models, options) {
      this.interviewId = options.interviewId;
    }
  });
});