define(function (require) {
  var Backbone = require('backbone');

  return Backbone.View.extend({
    initialize: function (options) {
      Backbone.View.prototype.initialize.apply(this, arguments);

      this.options = options || {};
      this.subViews = [];

      this.setUp();
    },

    render: function () {
      this.preRender();

      var template = _.result(this, 'template');
      var templateFn = _.template(template);

      var html = templateFn(this.getRenderContext());
      this.$el.html(html);
      this.rendered = true;

      this.eachSubView(function (subView, selector) {
        this.renderSubView(subView, selector);
      }, this);

      this.postRender();

      return this;
    },

    renderSubView: function (subView, selector) {
      var $container = this.$(selector);

      if ($container.length) {
        $container.append(subView.$el);
        subView.render();
      }
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
      if (this.rendered) {
        this.renderSubView(subView, selector);
      }
    },

    eachSubView: function (callback, ctx) {
      _.each(this.subViews, function (arr) {
        var selector = arr[0],
          subView = arr[1];

        callback.apply(ctx, [subView, selector]);
      });
    },

    getRenderContext: function () {
      return {
        model: this.model,
        view: this
      }
    },

    setUp: function () {
    },

    preRender: function () {
    },

    postRender: function () {
    }
  });
});