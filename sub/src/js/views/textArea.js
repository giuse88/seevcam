define(function(require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/text-area.html'),

    bindings: {},

    events: {},

    setUp: function () {
      this.bindings['#' + this.cid] = {
        observe: this.options.attribute,
        events: ['change']
      };

      if (this.options.autoSave) {
        this.events['keyup'] = 'onKeyUp';
      }

      this.saveAnswer = _.debounce(_.bind(function () {
        this.model.set('content', this.$('.answer').val());
      }, this), 2000);
    },

    onKeyUp: function () {
      this.saveAnswer();
    }
  });
});