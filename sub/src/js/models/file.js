define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    defaults: {
      id: null,
      type: null,
      size: null,
      original_name: null,
      url: null,
      delete_type: null,
      delete_url: null,
      name: null
    },

    url: function () {
      return '/files/' + this.id;
    }
  });
});