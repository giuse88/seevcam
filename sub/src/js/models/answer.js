define(function (require) {
  var _ = require('underscore');
  var Backbone = require('backbone');

  return Backbone.Model.extend({
    defaults: {
      id: null,
      content: null,
      question: null,
      rating: null
    },

    empty: function () {
      return _.isEmpty(this.get('content'));
    }
  });
});