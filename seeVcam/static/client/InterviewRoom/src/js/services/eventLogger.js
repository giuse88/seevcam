define(function (require) {
  var Event = require('models/event');

  return {
    eventType: Event.type,

    log: function (eventType, data) {
      var session = require('services/session');
      session.get('events').add({type: eventType, content: data}).save();
    }
  };
});