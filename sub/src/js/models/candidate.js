define(function (require) {
  var BaseModel = require('baseModel');

  return BaseModel.extend({
    defaults: {
      id: null,
      name: null,
      email: null,
      surname: null,
      cv: null
    }
  });
});