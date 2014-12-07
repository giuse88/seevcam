define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  return  Backbone.View.extend({

    template : _.template('<div id="interviews-grid" class="active"></div>'),

    render : function () {
      return this;
    }

  });

});
