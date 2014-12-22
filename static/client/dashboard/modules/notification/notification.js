define(function(require) {

  var Backbone = require("backbone");
  var _ = require("underscore");

  var AlertView = Backbone.View.extend({

    el: 'body',

    events:{
      "click .close" : "dismiss"
    },

    template: _.template('<div  class=" alert alert-dismissible alert-<%= type %> notification fade in">' +
      ' <strong><%= shortMessage %> </strong> <%= message %>' +
      '<button type="button" class="close" data-dismiss="alert"> ' +
      '  <span aria-hidden="true">&times;</span> ' +
      '  <span class="sr-only">Close</span>' +
      '</button>' +
      '</div>'),

    initialize: function () {
      _.bindAll(this, "dismiss");
      this.render();
    },

    render: function () {
      this.$el.append(this.template(this.model));
      return this;
    },

    dismiss: function(event){
      event.preventDefault();
      event.stopPropagation();
      this.$el.find(".notification.alert").alert("close");
    }

  });

  function warning(shortMessage, message) {
    return new AlertView({model: {type: "warning", message: message, shortMessage: shortMessage}});
  }

  function success(shortMessage, message) {
    return new AlertView({model: {type: "success", message: message, shortMessage: shortMessage}});
  }

  function error(shortMessage, message) {
    return new AlertView({model: {type: "danger", message: message, shortMessage: shortMessage}});
  }

  return {
         warning: warning,
         success :success,
         error : error
  };

});
