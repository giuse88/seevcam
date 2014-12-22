define(function (require) {
  var BaseView = require('baseView');
  var TextArea = require('views/textArea');

  return BaseView.extend({
    template: require('text!templates/notes.html'),

    setUp: function () {
      this.hasSubView('.notes', new TextArea({model: this.model, attribute: 'content'}));
    }
  });
});