require.config({

  baseUrl: './src/js',
  paths: {
    // App.js
    app : "./app",
    // lib
    jquery : "../../bower_components/jquery/dist/jquery",
    underscore : "../../bower_components/underscore/underscore",
    backbone : "../../bower_components/backbone/backbone",
    text : "../../bower_components/requirejs-text/text",
    baseView: "views/baseView",
    models: "models",
    collections: "collections",
    views: "views",
    pages: "pages",
    services: "services"
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