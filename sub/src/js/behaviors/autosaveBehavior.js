define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    setup: function (model) {
      this.model = model;

      model.on('change', this.execute, this);
    },

    execute: function () {
      this.model.save();
    }
  });
});