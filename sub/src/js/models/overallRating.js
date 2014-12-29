define(function (require) {
  var BaseModel = require('baseModel');
  var AutoSaveBehavior = require('behaviors/autosaveBehavior');

  return BaseModel.extend({
    defaults: {
      id: null,
      question: null,
      rating: null
    },

    initBehaviors: function () {
      this.attachBehavior(new AutoSaveBehavior());
    }
  })
});