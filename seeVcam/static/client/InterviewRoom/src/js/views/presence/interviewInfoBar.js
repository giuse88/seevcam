define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({

    className :'info-bar',
    template  : require('text!templates/presence/interview-info-bar.html'),

    setUp: function () {
      session = this.model.get("videoSession");
      this.listenTo(session, 'change', this.render, this);
    },

    getRenderContext: function() {
      return {
        model: this.model,
        session : session
      };
    }

  });
});
