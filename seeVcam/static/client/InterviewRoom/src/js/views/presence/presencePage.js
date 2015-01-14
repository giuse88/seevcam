define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/presence/presence-page.html'),

    initialize: function (options) {
      console.log("hello");
    },

    setUp: function () {

    }
  });
});
