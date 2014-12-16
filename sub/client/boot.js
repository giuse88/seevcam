require.config({

  baseUrl: './client/',
  paths: {
    // App.js
    app : "./app",
    // lib
    jquery : "../bower_components/jquery/dist/jquery",
    underscore : "../bower_components/underscore/underscore",
    backbone : "../bower_components/backbone/backbone"
  },
  shim: {
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "jquery" : {
      deps: [],
      exports: "$"
    },
    "underscore": {
      deps: [],
      exports: "_"
    }
  }
});
// kick off the apps
require(["app"]);