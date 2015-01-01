define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/interview/navigation-bar.html')
  });
});