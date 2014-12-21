define(function (require) {
  var _ = require('underscore');
  var BaseModel = require('baseModel');

  return BaseModel.extend({
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