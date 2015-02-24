define(function (require) {

  var BaseView = require("baseView");

  return BaseView.extend({
    className : "notes",
    template: require('text!./templates/notes.html')
  });

});
