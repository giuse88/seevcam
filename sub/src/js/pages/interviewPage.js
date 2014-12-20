define(['backbone', 'underscore', 'text!templates/interview-template.html'], function (Backbone, _, template) {
  return Backbone.View.extend({
    render: function () {
      this.$el.html(_.template(template)());

      return this;
    }
  });
});