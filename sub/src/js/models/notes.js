define(function (require) {
  var BaseModel = require('baseModel');

  return BaseModel.extend({
    defaults: {
      id: null,
      content: null
    },

    url: function () {
      return '/interviews/' + this.interviewId + '/notes';
    },

    initialize: function (models, options) {
      this.interviewId = options.interviewId;

      BaseModel.prototype.initialize.apply(this, arguments);
    }
  });
});