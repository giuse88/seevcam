define(function (require) {
  var BaseModel = require('baseModel');
  var moment = require('moment');

  return BaseModel.extend({
    defaults: function () {
      return {
        type: null,
        timestamp: moment().utc().format('HH:mm:ss.SSS'),
        content: {}
      }
    }
  }, {
    type: {
      RATE_CREATED: 'RATE_CREATED',
      RATE_UPDATED: 'RATE_UPDATED',
      ANSWER_CREATED: 'ANSWER_CREATED',
      ANSWER_UPDATED: 'ANSWER_UPDATED',
      QUESTION_SELECTED: 'QUESTION_SELECTED'
    }
  });
});