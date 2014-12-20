define(['backbone', 'moment'], function (Backbone, moment) {
  return Backbone.Model.extend({
    defaults: {
      id: null,
      start: null,
      end: null,
      status: null,
      job_position: null,
      catalogue: null,
      job_position_name: null,
      candiate: {
        id: null,
        name: null,
        email: null,
        surname: null,
        cv: null
      }
    },

    duration: function (unit) {
      unit = unit || "minutes";

      var startMoment = moment(this.get('start'));
      var endMoment = moment(this.get('end'));

      return endMoment.diff(startMoment, unit);
    }
  });
});
