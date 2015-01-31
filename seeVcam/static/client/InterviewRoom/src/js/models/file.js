define(function (require) {
  var BaseModel = require('baseModel');

  return BaseModel.extend({
    defaults: {
      type: null,
      size: null,
      original_name: null,
      url: null,
      delete_type: null,
      delete_url: null,
      name: null
    },

    url: function () {
      return '/dashboard/files/' + this.id;
    },

    absoluteUrl: function () {
      var result;
      var url = this.get('url') || '';

      if (url.indexOf('http') != 0) {
        var documentRelativeUrl = this.get('url');
        var baseUrl = document.location.origin;

        result = baseUrl + documentRelativeUrl;
      } else {
        result = url;
      }

      return result;
    }
  });
});