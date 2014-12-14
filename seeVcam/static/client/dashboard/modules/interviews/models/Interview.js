define(function(require) {

  require("deep-model");
  require("backbone-forms");
  var Backbone = require("backbone");
  var Questions = require("modules/questions/models/Questions");

  var FIVE_MINUTES = 60000 *5;
  var BLUE = '#0071bb';

  return Backbone.DeepModel.extend({

    schema: {
        candidate : { type : 'Object', subSchema : {
          name:       { type:'Text', validators: ['required']},
          surname:    { type:'Text', validators: ['required']},
          email:      { validators: ['required', 'email'] },
          cv:         { type: 'Number', validators:['required']}
          }
        },
        start:      { type:'DateTime', validators:['required']},
        end:        { type:'DateTime', validators:['required']}
    },

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
        color : BLUE
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
