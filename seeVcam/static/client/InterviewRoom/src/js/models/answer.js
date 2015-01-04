define(function (require) {
  var _ = require('underscore');
  var BaseModel = require('baseModel');
  var AutoSaveBehavior = require('behaviors/autosaveBehavior');

  return BaseModel.extend({
    defaults: {
      content: null,
      question: null,
      rating: null
    },

    initBehaviors: function () {
      this.attachBehavior(new AutoSaveBehavior({ignore: ['id', 'question']}));
    },

    hasContent: function () {
      return !_.isEmpty(this.get('content'));
    },

    hasRating: function () {
      return typeof this.get('rating') === 'number';
    }
  });
});