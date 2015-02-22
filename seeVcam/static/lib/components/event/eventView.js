define(function (require) {
  var BaseView = require('baseView');
  var Event = require('models/event');

  return BaseView.extend({

    tagName : "li",

    template: function () {
      var result;

      switch (this.model.get('type')) {
        case Event.type.RATE_CREATED:
          result = require("text!./templates/event-question-rated.html");
          break;
        case Event.type.RATE_UPDATED:
          result = require("text!./templates/event-question-rating-updated.html");
          break;
        case Event.type.ANSWER_CREATED:
          result = require("text!./templates/event-answer-update.html");
          break;
        case Event.type.ANSWER_UPDATED:
          result = require("text!./templates/event-answer-update.html");
          break;
        case Event.type.QUESTION_SELECTED:
          result = require("text!./templates/event-question-selected.html");
          break;
        default:
          result = "";
      }

      return result;
    },

    initialize : function (options) {
      this.questions = options.questions;
      this.answers = options.answers;
    },

    getQuestionNumber: function () {
      var eventContent =  JSON.parse(this.model.get('content'));
      var question = this.questions.findWhere({id: eventContent.question_id});
      return this.questions.indexOf(question) + 1;
    },

    getQuestionAnswer: function () {
      var eventContent =  JSON.parse(this.model.get('content'));
      var answer = this.answers.findWhere({question: eventContent.question_id});
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