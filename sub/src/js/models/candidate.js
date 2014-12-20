define(['backbone'], function (Backbone) {
  return Backbone.Model.extend({
    defaults: {
      id: null,
      name: null,
      email: null,
      surname: null,
      cv: null
    }
  });
});