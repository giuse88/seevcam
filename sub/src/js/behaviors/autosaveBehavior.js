define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    setup: function (model) {
      this.model = model;

      this.model.isDirty = false;
      this.model.on('sync', this.markClean, this);
      this.model.on('change', this.execute, this);
    },

    execute: function (model, options) {
      var notTracked = this.get('ignore') || [];
      var changedAttributes = Object.keys(this.model.changed);
      this.model.isDirty = this.model.isDirty || _.any(changedAttributes, function (changedAttribute) {
        return !_.include(notTracked, changedAttribute);
      });

      var isFetchChange = options && options.parse;
      if (!this.model.isDirty || isFetchChange) return;

      this.model.save()
        .then(_.bind(function () {
          this.markClean();
        }, this));
    },

    markClean: function () {
      this.model.isDirty = false;
    }
  });
});