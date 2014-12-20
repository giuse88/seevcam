define(['backbone'], function (Backbone) {
  var Session = Backbone.Model.extend({
    elapsedTime: function (unit) {
      unit = unit || 'minutes';

      var interview = this.get('interview');

      return moment.utc().diff(this.get('sessionStart'), unit);
    }
  });

  return new Session();
});