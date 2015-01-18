define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({

    template  : require('text!templates/presence/start-interview.html'),

    events : {
      'click a'  : 'goToFullVideo'
    },

    setUp: function () {
      this.videoSession = this.model.get("videoSession");
      this.listenTo(this.videoSession, 'change:interviewState',function () { return this.render() }, this);
    },

    getRenderContext: function() {
      console.log("Rendering interview start", this.videoSession.get("interviewState"));
      return {
        model : this.model,
        isInterviewReady : this.videoSession.isInterviewReady()
      };
    },

    goToFullVideo : function (e) {
      e.preventDefault();
      if (this.videoSession.isInterviewReady()) {
        console.log("go to interview video ready");
        window.router.navigate("interview/full-video/", {trigger: true});
      } else {
        console.log("Interview is not ready");
      }
    }

  });
});
