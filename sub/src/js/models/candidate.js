define(function (require) {
  var BaseModel = require('baseModel');

  return BaseModel.extend({
    defaults: {
      name: null,
      email: null,
      surname: null,
      cv: null
    }
  });
});