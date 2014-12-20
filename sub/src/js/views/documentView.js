define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/document.html'),

    documentUrl: function () {
      var documentRelativeUrl = this.model.get('url');
      var baseUrl = document.location.origin;

      return baseUrl + documentRelativeUrl;
    }
  });
});