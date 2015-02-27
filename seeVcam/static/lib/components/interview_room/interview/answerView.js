define(function (require) {
  var BaseView = require('baseView');
  var TextArea = require('components/text_area/textArea');
  var AnswerRating = require('components/answer_rating/answerRating');

  return BaseView.extend({
    template: require('text!./templates/answer.html'),

    setUp: function () {
      this.listenTo(this.model, 'change:content', this.answerUpdated, this);
      this.listenTo(this.model, 'request', this.answerSaving, this);
      this.listenTo(this.model, 'sync', this.answerSaved, this);

      this.attachSubView('.answer', new TextArea({model: this.model, attribute: 'content'}));
      this.attachSubView('.ratings-container', new AnswerRating({model: this.model, big: true, edit:true}));
    },

    answerUpdated: function () {
      var eventLogger = require('services/eventLogger');

      if (_.isEmpty(this.model.previous('content'))) {
        eventLogger.log(eventLogger.eventType.ANSWER_CREATED, {content: this.model.get('content'), question_id: this.model.get('question')});
      } else {
        eventLogger.log(eventLogger.eventType.ANSWER_UPDATED, {content: this.model.get('content'), question_id: this.model.get('question')});
      }
    },

    answerSaving: function () {
      this.$('.status').removeClass('saved').addClass('saving');
    },

    answerSaved: function () {
      this.$('.status').removeClass('saving').addClass('saved');
    }
  });
});