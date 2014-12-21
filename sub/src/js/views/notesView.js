define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/notes.html'),

    bindings: {
      '.notes-input' : {
        observe: 'content',
        events: ['change']
      }
    }
  });
});