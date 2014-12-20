define(['backbone'], function (Backbone) {
  return Backbone.View.extend({
    initialize: function () {
      Backbone.View.prototype.initialize.apply(this, arguments);

      this.subViews = [];

      this.setUp();
    },

    setUp: function () {
    },

    render: function () {
      var template = _.result(this, 'template');
      var templateFn = _.template(template);

      var html = templateFn(this.getRenderContext());
      this.$el.html(html);

      this.eachSubView(function (subView, selector) {
        var $container = this.$(selector);

        if ($container.length) {
          $container.append(subView.$el);
          subView.render();
        }
      });

      return this;
    },

    teardown: function () {
      var args = arguments;

      this.eachSubView(function (subView) {
        subView.teardown.apply(subView, args);
      });

      this.stopListening();
      this.undelegateEvents();
    },

    hasSubView: function (selector, subView) {
      this.subViews.push([selector, subView]);
    },

    eachSubView: function (callback) {
      _.each(this.subViews, function (arr) {
        var selector = arr[0],
          subView = arr[1];

        callback(subView, selector);
      });
    },

    getRenderContext: function () {
      return {
        model: this.model,
        view: this
      }
    }
  });
});