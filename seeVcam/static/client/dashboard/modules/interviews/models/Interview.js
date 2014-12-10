define(function(require) {

  require("deep-model");
  var Backbone = require("backbone");
  var Questions = require("modules/questions/models/Questions");

  var FIVE_MINUTES = 60000 *5;

  return Backbone.DeepModel.extend({


    getCandidateFullName : function () {
      return this.get("candidate.name") + " " + this.get("candidate.surname");
    },

    toCalendarEvent : function() {
      return {
        id : this.get("id"),
        title : this.getCandidateFullName(),
        start : this.get("start"),
        end : this.get("end"),
        allDay : false,
        color : '#0071bb'
      }
    },

    isOpen : function () {
      var now = new Date();
      var startTime = new Date(this.get("start"));
      var endTime = new Date(this.get("end"));
      return now.getTime() >= (startTime.getTime() - FIVE_MINUTES) &&  now.getTime() < endTime.getTime();
    }

  });

});
