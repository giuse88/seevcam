define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/document.html'),

    documentUrl: function () {
      return 'http://docs.google.com/viewer?embedded=true&url=' + encodeURIComponent(this.model.absoluteUrl());
    }
  });
});