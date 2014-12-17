define(function(require) {

  require("deep-model");
  var Backbone = require("backbone");
  var FileUploaded = require("modules/interviews/models/FileUploaded");

  var FIVE_MINUTES = 60000 *5;
  var BLUE = '#0071bb';

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
        color : BLUE
      }
    },

    isOpen : function () {
      var now = new Date();
      var startTime = new Date(this.get("start"));
      var endTime = new Date(this.get("end"));
      return now.getTime() >= (startTime.getTime() - FIVE_MINUTES) &&  now.getTime() < endTime.getTime();
    },

    isCVFetched : function () {
      return !!this.cvFetched;
    },

    getCV : function () {
      return this.candidateCv;
    },

    fetchCV :function (successCb, errocb ) {
      var self = this;

      if ( this.candidateCv ) {
        return successCb(this);
      }

      this.candidateCv = new FileUploaded({id:this.get('candidate.cv')});
      this.candidateCv.fetch({
          success: function () {
            self.cvFetched = true;
            successCb.apply(arguments);
          },
          error : errocb
      });
    }


  });

});
