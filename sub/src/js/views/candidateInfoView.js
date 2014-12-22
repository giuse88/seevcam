define(function (require) {
  var _ = require('underscore');
  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!templates/candidate-info.html'),

    getRenderContext: function () {
      return {
        candidate: this.model.get('candidate'),
        jobPosition: this.model.get('jobPosition'),
        interview: this.model.get('interview'),
        model: this.model,
        view: this
      };
    },

    postRender: function () {
      this.refreshInterval = setInterval(_.bind(this.refreshRemainingTime, this), 10000);
      this.progressBarInterval = setInterval(_.bind(this.updateProgress, this), 1000);
      this.updateProgress();
    },

    teardown: function () {
      if (this.refreshInterval != undefined) {
        clearTimeout(this.refreshInterval);
      }
      if (this.progressBarInterval != undefined) {
        clearTimeout(this.progressBarInterval);
      }

      BaseView.prototype.teardown.apply(this, arguments);
    },

    updateProgress: function () {
      var interview = this.model.get('interview');
      var elapsedTime = interview.elapsedTime('seconds');
      var totalTime = interview.duration('seconds');
      var elapsedPercentage = (elapsedTime / totalTime) * 100;

      if (elapsedPercentage <= 100) {
        this.$('#progress').css("width", elapsedPercentage + "%");
      }
    },

    refreshRemainingTime: function () {
      var interview = this.model.get('interview');
      var elapsedTime = interview.elapsedTime();

      if (elapsedTime < interview.duration()) {
        this.$('.passed').text(interview.elapsedTime());
      }
    }
  });
});