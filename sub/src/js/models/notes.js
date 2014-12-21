define(function (require) {
  var BaseModel = require('baseModel');
  var AutoSaveBehavior = require('behaviors/autosaveBehavior');

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
    },

    initBehaviors: function () {
      this.attachBehavior(new AutoSaveBehavior());
    }
  });
});