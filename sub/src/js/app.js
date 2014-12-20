define(function (require) {
  var Router = require('./router');
  var Backbone = require('backbone');

  new Router();
  Backbone.history.start();
});