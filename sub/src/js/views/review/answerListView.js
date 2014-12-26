define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/review/answer-list.html')
  });
});