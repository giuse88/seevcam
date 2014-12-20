define(function (require) {
  var BaseView = require('baseView');
  var Event = require('models/event');

  return BaseView.extend({
    template: function () {
      var result;

      switch (this.model.get('type')) {
        case Event.type.rated:
          result = require("text!templates/event-question-rated.html");
          break;
        case Event.type.rateUpdated:
          result = require("text!templates/event-question-rating-updated.html");
          break;
        case Event.type.answerUpdate:
          result = require("text!templates/event-answer-update.html");
          break;
        case Event.type.questionSelected:
          result = require("text!templates/event-question-selected.html");
          break;
        default:
          result = "";
      }

      return result;
    },

    getQuestionNumber: function () {
      var session = require('services/session');
      var questions = session.get('questions');
      var question = questions.findWhere({id: this.model.get('content').question_id});

      return questions.indexOf(question) + 1;
    },

    getQuestionAnswer: function () {
      var session = require('services/session');
      var answers = session.get('answers');

      var answer = answers.findWhere({question: this.model.get('content').question_id});
      return answer.get('content');
    },

    getQuestionRatingClass: function (rating) {
      var result = '';
      if (rating < 4) {
        result = 'negative-active-icon';
      } else if (rating < 8) {
        result = 'neuter-active-icon';
      } else {
        result = 'positive-active-icon';
      }

      return result;
    }
  });
});