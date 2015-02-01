define(function (require) {
  var BaseView = require('baseView');
  var Event = require('models/event');

  return BaseView.extend({

    tagName : "li",

    template: function () {
      var result;

      switch (this.model.get('type')) {
        case Event.type.RATE_CREATED:
          result = require("text!templates/interview/event-question-rated.html");
          break;
        case Event.type.RATE_UPDATED:
          result = require("text!templates/interview/event-question-rating-updated.html");
          break;
        case Event.type.ANSWER_CREATED:
          result = require("text!templates/interview/event-answer-update.html");
          break;
        case Event.type.ANSWER_UPDATED:
          result = require("text!templates/interview/event-answer-update.html");
          break;
        case Event.type.QUESTION_SELECTED:
          result = require("text!templates/interview/event-question-selected.html");
          break;
        default:
          result = "";
      }

      return result;
    },

    getQuestionNumber: function () {
      var session = require('services/session');
      var questions = session.get('questions');
      var eventContent =  JSON.parse(this.model.get('content'));
      var question = questions.findWhere({id: eventContent.question_id});
      return questions.indexOf(question) + 1;
    },

    getQuestionAnswer: function () {
      var session = require('services/session');
      var answers = session.get('answers');
      var eventContent =  JSON.parse(this.model.get('content'));
      var answer = answers.findWhere({question: eventContent.question_id});
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