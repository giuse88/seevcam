define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    defaults: {
      id: null,
      content: null
    },

    url: function () {
      return '/interviews/' + this.interviewId + '/notes';
    },

    initialize: function (models, options) {
      this.interviewId = options.interviewId;
    }
  });
});