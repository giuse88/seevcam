define(function (require) {
  var BaseView = require('baseView');
  var EventView = require('views/interview/eventView');

  return BaseView.extend({
    template: require('text!templates/interview/event-list.html'),
    listSelector: '.event-list',

    className : 'events-wrapper',

    setUp: function () {
      this.collection.each(function (event) {
        this.addEvent(event);
      }, this);

      this.listenTo(this.collection, 'add', this.addEvent, this);
    },

    addEvent: function (event) {
      this.attachSubView(this.listSelector, new EventView({model: event}));

      if (this.rendered) {
        this.scrollToBottom();
      }
    },

    postRender: function () {
      this.scrollToBottom();
    },

    scrollToBottom: function () {
      var $scrollable = this.$el.get(0);
      $scrollable.scrollTop = $scrollable.scrollHeight;
    }
  });
});