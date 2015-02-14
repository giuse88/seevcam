define(function (require) {
  var BaseView = require('baseView');
  var TextArea = require('../controls/textArea');
  var QuestionPresenter = require('presenters/questionPresenter');

  return BaseView.extend({
    template: require('text!./templates/answer.html'),

    events: {
      'click .edit': 'onClickEdit'
    },

    initialize: function (options) {
      this.question = options.question;

      BaseView.prototype.initialize.apply(this, arguments);
    },

    onClickEdit: function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $answer = this.$('.answer');
      var textArea = new TextArea({model: this.model, attribute: 'content', autoSize: true});
      this.listenTo(textArea, 'focusout', function () {
        this.detachSubView(textArea);
        this.render();
      }, this);

      $answer.empty();
      this.attachSubView('.answer', textArea);
      textArea.focus();
    },

    questionNumber: function () {
      return QuestionPresenter.questionNumber(this.question);
    }
  });
});