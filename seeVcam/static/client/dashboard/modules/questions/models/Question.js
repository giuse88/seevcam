define(function(require){

  var Backbone = require("backbone");

  return Backbone.Model.extend({
    defaults: {
      question_text: ""
    },

    parse: function (response) {
      return response;
    }
  });
});



