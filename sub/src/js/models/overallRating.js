define(function () {
  var BaseModel = require('baseModel');

  return BaseModel.extend({
    defaults: {
      id: null,
      question: null,
      rating: null
    }
  })
});