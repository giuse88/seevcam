define(function (require) {
  var BaseModel = require('baseModel');
  var moment = require('moment');

  return BaseModel.extend({
    defaults: function () {
      return {
        id: null,
        type: null,
        timestamp: moment.utc().format(),
        content: {}
      }
    }
  }, {
    type: {
      rated: 'ANSWER_RATE',
      rateUpdated: 'RATED_UPDATE',
      answerUpdate: 'ANSWER_UPDATE',
      questionSelected: 'QUESTION_SELECTED'
    }
  });
});