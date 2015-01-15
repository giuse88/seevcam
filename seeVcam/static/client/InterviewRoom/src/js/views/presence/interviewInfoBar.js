define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({

    className :'info-bar',
    template  : require('text!templates/presence/interview-info-bar.html'),

    setUp: function () {
      console.log(this.model);
      this.listenTo(this.model, 'change', this.render, this);
    }

  });
});
