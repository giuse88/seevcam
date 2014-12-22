define(function (require) {
  var BaseModel = require('baseModel');

  return BaseModel.extend({
    id: null,
    position: null,
    job_spec: null
  });
});