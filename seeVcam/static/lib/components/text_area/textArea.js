define(function(require) {
  var BaseView = require('baseView');
  require('jquery.textarea.autoresize');

  return BaseView.extend({
    template: require('text!./text-area.html'),

    bindings: {},

    propagatedEvents: {
      'focusout textarea': 'focusout'
    },

    setUp: function () {
      this.bindings['#' + this.cid] = {
        observe: this.options.attribute,
        events: ['change']
      };
    },

    postRender: function () {
      if (this.options.autoSize) {
        this.$('textarea').autoresize().trigger('keydown.autoresize');
      }
    },

    focus: function () {
      this.$('textarea').focus();
    },

    teardown: function () {
      this.$('textarea').trigger('autosize.destroy');

      BaseView.prototype.teardown.apply(this, arguments);
    }
  });
});