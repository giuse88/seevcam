define(function (require) {
  var BaseModel = require('baseModel');
  var moment = require('moment');

  return BaseModel.extend({

    url : function () {
      return "/dashboard/interviews/interviews/" + this.get("id") + "/"
    },

    defaults: {
      start: null,
      end: null,
      status: null,
      job_position: null,
      catalogue: null,
      job_position_name: null,
      candiate: {
        name: null,
        email: null,
        surname: null,
        cv: null
      }
    },

    duration: function (unit) {
      unit = unit || "minutes";

      var startMoment = moment.utc(this.get('start'));
      var endMoment = moment.utc(this.get('end'));

      return endMoment.diff(startMoment, unit);
    },

    elapsedTime: function (unit) {
      unit = unit || 'minutes';
      var startMoment = moment.utc(this.get('start'));
      var currentMoment = moment.utc();
      return currentMoment.diff(startMoment, unit);
    }
  });
});
