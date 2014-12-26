define(function(require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/controls/text-area.html'),

    bindings: {},

    setUp: function () {
      this.bindings['#' + this.cid] = {
        observe: this.options.attribute,
        events: ['change']
      };
    }
  });
});