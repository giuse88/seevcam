require.config({

  baseUrl: '/static/bower_components/',
  paths: {
    // App.js
    app : "../client/interview_room/app",
    // lib
    jquery : "jquery/dist/jquery",
    underscore : "",
    backbone : ""
    // dashboard
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