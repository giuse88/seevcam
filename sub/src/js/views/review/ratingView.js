define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    className: 'rating',
    template: require('text!templates/review/rating.html')
  })
});