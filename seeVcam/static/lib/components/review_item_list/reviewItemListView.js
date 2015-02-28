define(function (require) {

  require('slimscroll');

  var BaseView = require('baseView');
  var ReviewItemView = require('./reviewItemView');

  return BaseView.extend({
    template: require('text!./templates/review-item-list.html'),
    className : "review-item-list",

    initialize: function (options) {
      this.questions = options.questions;
      BaseView.prototype.initialize.apply(this, arguments);
    },

    postRender: function () {
      var windowWidth = this.$el.width();
      this.$el.slimScroll({
        height: 'auto',
        position: 'right',
        alwaysVisible: true,
        railVisible: true,
        distance: (windowWidth / 2 + windowWidth / 200) + 'px'
      });
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
          this.attachSubView('.items', new ReviewItemView({
            model: item.answer,
            question: item.question,
            edit : !!this.options.edit
          }));
        }, this)
        .value();
    }
  });
});