define(function (require) {
  var Backbone = require('backbone');
  var moment = require('moment');

  return Backbone.Model.extend({
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