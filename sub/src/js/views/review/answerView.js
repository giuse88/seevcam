define(function (require) {
  var BaseView = require('baseView');
  var QuestionView = require('views/review/questionView');

  return BaseView.extend({
    template: require('text!templates/review/answer.html'),

    initialize: function (options) {
      this.question = options.question;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    setUp: function () {
      this.hasSubView('.question', new QuestionView({model: this.question}));
    }
  });
});