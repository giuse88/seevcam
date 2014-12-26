define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/controls/document.html'),

    documentUrl: function () {
      return '//docs.google.com/viewer?embedded=true&url=' + encodeURIComponent(this.model.absoluteUrl());
    }
  });
});