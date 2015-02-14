define(function (require) {
  var OverallRating = require('models/overall_rating');
  var Backbone = require('backbone');

  return Backbone.Collection.extend({
    model: OverallRating,

    url: function () {
      return '/dashboard/interviews/' + this.interviewId + '/overall_ratings';
    },

    initialize: function (models, options) {
      this.interviewId = options.interviewId;
    }
  });
});