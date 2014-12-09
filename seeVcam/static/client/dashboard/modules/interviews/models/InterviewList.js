define(function(require){

  var Backbone = require("backbone");
  var Interview = require("modules/interviews/models/Interview");
  var notification = require("notification");

  return  Backbone.Collection.extend({
        model: Interview,
        url: "/dashboard/interviews/interviews",

        initialize: function (interviews) {
        }

    });

});