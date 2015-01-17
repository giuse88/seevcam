define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({

    template  : require('text!templates/presence/start-interview.html'),

    setUp: function () {
      this.videoSession = this.model.get("videoSession");
      this.listenTo(this.videoSession, 'change:interviewState',function () { return this.render() }, this);
    },

    getRenderContext: function() {
      console.log("Rendering interview start", this.videoSession.get("interviewState"));
      return {
        model : this.model,
        isInterviewReady : this.videoSession.get("interviewState") === "READY"
      };
    }

  });
});
