define(['backbone'], function (Backbone) {
  return Backbone.View.extend({
    render: function () {
      this.$el.text('ha');
      return this;
    }
  });
});