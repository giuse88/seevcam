define(function (require) {
  var OverallRating = require('models/overallRating');
  var Backbone = require('backbone');

  return Backbone.Collection.extend({
    model: OverallRating,

    url: function () {
      return '/interviews/' + this.interviewId + '/overallratings';
    },

    initialize: function (models, options) {
      this.interviewId = options.interviewId;
    }
  });
});