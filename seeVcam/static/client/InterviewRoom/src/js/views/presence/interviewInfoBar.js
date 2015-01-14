define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({
    className   :'info-bar',
    template: require('text!templates/presence/interview-info-bar.html'),

    setUp: function () {
     console.log("Presence page");

      // this should listen for change in the video session
//      this.listenTo(this.model, 'change:content', this.answerUpdated, this);
//      this.listenTo(this.model, 'request', this.answerSaving, this);
//      this.listenTo(this.model, 'sync', this.answerSaved, this);

    }

  });
});
