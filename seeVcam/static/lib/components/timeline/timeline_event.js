define(function (require) {

  var BaseView = require('baseView');

  return BaseView.extend({
    template: require('text!./templates/timeline_event.html'),
    className : "cd-timeline-block"
  });

});