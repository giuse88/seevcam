require.config({

  baseUrl: '/static/',
  paths: {
    // App.js
    app             : "client/interview_room/app",
    "modules"       : "client/interview_room/modules",
    // lib
    "jquery"        : "bower_components/jquery/dist/jquery",
    "backbone"      : "bower_components/backbone/backbone",
    "underscore"    : "bower_components/underscore/underscore",
    "opentok"       : "client/vendor/opentok.min"
  },
  shim: {
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "underscore": {
      deps: [],
      exports: "_"
    }
  }
});
// kick off the apps
require(["app"]);