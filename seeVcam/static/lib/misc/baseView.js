define(function (require) {
  require('backbone.stickit');
  require('bootstrap');

  var Modal = require("backbone.bootstrap-modal");
  var _ = require('underscore');
  var Backbone = require('backbone');

  return Backbone.View.extend({
    events: {},
    propagatedEvents: {},

    constructor: function (options) {
      this.options = options || {};
      this.subViews = [];
      this.events = _.extend({}, this.events);

      _.each(this.propagatedEvents, function (propagatedEvent, delegatingEvent) {
        this.events[delegatingEvent] = _.bind(function () {
          this.trigger(propagatedEvent, this);
        }, this);
      }, this);

      Backbone.View.apply(this, arguments);

      this.setUp();
    },

    render: function () {
      this.preRender();

      var template = _.result(this, 'template') || '';
      var templateFn = _.template(template);

      var html = templateFn(this.getRenderContext());
      this.$el.html(html);
      this.rendered = true;

      if (this.bindings && this.model) {
        this.stickit();
      }

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

    attachSubView: function (selector, subView) {
      this.subViews.push([selector, subView]);
      if (this.rendered) {
        this.renderSubView(subView, selector);
      }
    },

    detachSubView: function (subView) {
      var subViewDefinition = _.find(this.subViews, function (arr) {
        return arr[1] === subView;
      });

      this.subViews = _.without(this.subViews, subViewDefinition);
      subView.teardown();
      if (this.rendered) {
        var selector = subViewDefinition[0];
        this.$(selector).empty();
      }
    },

    openModal: function (contentView, options) {
      new Modal(_.extend(options, {content: contentView})).open();
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
        collection: this.collection,
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