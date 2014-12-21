define(function (require) {
  var BaseModel = require('baseModel');

  return BaseModel.extend({
    defaults: {
      id: null,
      type: null,
      size: null,
      original_name: null,
      url: null,
      delete_type: null,
      delete_url: null,
      name: null
    },

    url: function () {
      return '/files/' + this.id;
    },

    absoluteUrl: function () {
      var result;
      var url = this.get('url') || '';

      if (url.indexOf('http') != 0) {
        var documentRelativeUrl = this.model.get('url');
        var baseUrl = document.location.origin;

        result = baseUrl + documentRelativeUrl;
      } else {
        result = url;
      }

      return result;
    }
  });
});