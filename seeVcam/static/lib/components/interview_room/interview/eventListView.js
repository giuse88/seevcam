define(function (require) {
  var BaseView = require('baseView');
  var EventView = require('components/event/eventView');

  return BaseView.extend({
    template: require('text!./templates/event-list.html'),
    listSelector: '.event-list',

    className : 'events-wrapper',

    setUp: function () {
      this.collection.each(function (event) {
        this.addEvent(event);
      }, this);

      this.listenTo(this.collection, 'add', this.addEvent, this);
    },

    addEvent: function (event) {
      var session = require('services/session');
      this.attachSubView(this.listSelector, new EventView({
        model: event,
        questions : session.get('questions'),
        answers : session.get("answers")
      }));

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