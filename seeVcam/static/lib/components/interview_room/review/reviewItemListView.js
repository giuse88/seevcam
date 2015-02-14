define(function (require) {
  var BaseView = require('baseView');
  var ReviewItemView = require('./reviewItemView');

  return BaseView.extend({
    template: require('text!./templates/review-item-list.html'),

    initialize: function (options) {
      this.questions = options.questions;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.collection.chain()
        .filter(function (answer) {
          return answer.hasContent() || answer.hasRating();
        })
        .map(function (answer) {
          return {
            answer: answer,
            question: this.questions.findWhere({id: answer.get('question')})
          };
        }, this)
        .sortBy(function (item) {
          return item.question.id; // TODO: replace with position
        })
        .each(function (item) {
          this.attachSubView('.items', new ReviewItemView({model: item.answer, question: item.question}));
        }, this)
        .value();
    }
  });
});