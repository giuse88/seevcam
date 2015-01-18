define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({

    template  : require('text!templates/presence/full-video-page.html'),

    setUp: function () {
      this.videoSession = this.model.get("videoSession");
    },
    postRender : function () {
//      this.videoSession.activeRemoteVideo('remote-video-container');
      this.$remoteContainer = this.$el.find('.remote-video-container');
      this.$remoteContainer.height(window.innerHeight);
      this.$remoteContainer.width(window.innerWidth);
//      this.$localContainer = this.$el.find('.local-video-container');
//      this.$localContainer.html(this.videoSession.publisher.element);
//      this.videoSession.initPublisher('local-video-container');
    }
  });
});