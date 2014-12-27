define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    setup: function (model) {
      this.model = model;

      this.model.isDirty = false;
      this.model.on('change', this.execute, this);
    },

    execute: function () {
      var notTracked = this.get('ignore') || [];
      var changedAttributes = Object.keys(this.model.changed);
      this.model.isDirty = this.model.isDirty || _.any(changedAttributes, function (changedAttribute) {
        return !_.include(notTracked, changedAttribute);
      });

      if (!this.model.isDirty) return;

      this.model.save()
        .then(_.bind(function () {
          this.model.isDirty = false
        }, this));
    }
  });
});