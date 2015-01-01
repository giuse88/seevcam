define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    initialize: function () {
      this.initBehaviors();
    },

    initBehaviors: function () {
    },

    attachBehavior: function (behavior) {
      behavior.setup(this);
    }
  });
});