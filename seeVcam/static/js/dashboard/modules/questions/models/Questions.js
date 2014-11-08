define(function(require){

  var Question = require("modules/questions/models/Question");
  var Backbone = require("backbone");

  return Backbone.Collection.extend({

    model: Question,

    initialize: function (models, options) {
      this.catalogue = options.catalogue;
      this.url = "/dashboard/questions/catalogue/" + this.catalogue.get('id') + "/list/";

      function fetchFailure(model, response) {
        var message = "Error fetching questions for " + model.catalogue.get('catalogue_name') + "!";
        console.error(message);
        console.log(response.responseText);
        notification.error(message, "Re-loading the page might fix this problem.");
      }

      if (models.length === 0) {
        this.fetch({
          reset: true,
          error: fetchFailure
        });
      }
    }

  });

});