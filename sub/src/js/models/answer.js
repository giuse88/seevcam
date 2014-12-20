define(function (require) {
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    defaults: {
      id: null,
      content: null,
      question: null,
      rating: null
    }
  });
});