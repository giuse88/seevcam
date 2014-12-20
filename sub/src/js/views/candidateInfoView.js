define(function (require) {
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/candidate-info.html'),

    setUp: function () {
      this.refreshInterval = setInterval(_.bind(this.refreshRemainingTime, this), 10000);
    },

    getRenderContext: function () {
      return {
        candidate: this.model.get('candidate'),
        jobPosition: this.model.get('jobPosition'),
        interview: this.model.get('interview'),
        model: this.model,
        view: this
      };
    },

    teardown: function () {
      clearTimeout(this.refreshInterval);

      BaseView.prototype.teardown.apply(this, arguments);
    },

    refreshRemainingTime: function () {
      this.$('.passed').text(this.model.elapsedTime());
    }
  });
});