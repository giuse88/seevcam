define(function (require) {
  var BaseView = require('baseView');
  var TextArea = require('views/controls/textArea');

  return BaseView.extend({
    template: require('text!templates/review/answer.html'),

    events: {
      'click .edit': 'onClickEdit'
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
    }
  });
});