define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({

    template  : require('text!templates/presence/full-video-page.html'),

    initialize: function (options) {
      this.videoSession = this.model.get("videoSession");
      this.publisher = this.videoSession.getPublisher();
    },

    postRender : function () {
      this.$remoteContainer = this.$el.find('.remote-video-container');
      this.$localContainer = this.$el.find('.local-video-container');
      this.$remoteContainer.height(window.innerHeight);
      this.$remoteContainer.width(window.innerWidth);
      // publish local video to the session
      this.videoSession.publish();
      // subscribing to remote video
      this.videoSession.subscribe(this.$remoteContainer[0]);
      this.$localContainer.html(this.publisher.element);
      // setting local video css
      this.$localContainer
        .find('.OT_root')
        .height(240)
        .width(320)
    }
  });
});