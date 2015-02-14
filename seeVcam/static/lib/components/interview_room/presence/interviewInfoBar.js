define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({

    className :'info-bar',
    template  : require('text!./templates/interview-info-bar.html'),

    setUp: function () {
      this.session = this.model.get("videoSession");
      this.listenTo(this.session, 'change', this.render, this);
    },

    getRenderContext: function() {
      return {
        model: this.model,
        session : this.session
      };
    }

  });
});
