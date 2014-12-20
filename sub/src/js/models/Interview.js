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
  });
});
