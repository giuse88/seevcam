define(function (require) {
  var BaseModel = require('baseModel');

  return BaseModel.extend({
    position: null,
    job_spec: null
  });
});