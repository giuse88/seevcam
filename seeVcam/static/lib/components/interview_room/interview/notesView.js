define(function (require) {
  var BaseView = require('baseView');
  var TextArea = require('components/text_area/textArea');

  return BaseView.extend({
    template: require('text!./templates/notes.html'),

    setUp: function () {
      this.attachSubView('.notes', new TextArea({model: this.model, attribute: 'content'}));
    }
  });
});