define(function (require) {
  var BaseView = require('baseView');
  var EventView = require('views/eventView');

  return BaseView.extend({
    template: require('text!templates/event-list.html'),
    listSelector: '.event-list',

    setUp: function () {
      this.collection.each(function (event) {
        this.addEvent(event);
      }, this);

      this.listenTo(this.collection, 'add', this.addEvent, this);
    },

    renderSubView: function (subView, selector) {
      var $container = this.$(selector);

      if ($container.length) {
        $container.prepend(subView.$el);
        subView.render();
      }
    },

    addEvent: function (event) {
      this.hasSubView(this.listSelector, new EventView({model: event, el: $('<li></li>')}));
    }
  });
});