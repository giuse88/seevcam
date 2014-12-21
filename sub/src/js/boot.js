require.config({

  baseUrl: './src/js',
  paths: {
    // App.js
    app : "./app",
    // lib
    jquery : "../../bower_components/jquery/dist/jquery",
    'jquery.mockjax' : "../../bower_components/jquery-mockjax/jquery.mockjax",
    underscore : "../../bower_components/underscore/underscore",
    moment: "../../bower_components/momentjs/moment",
    backbone : "../../bower_components/backbone/backbone",
    'backbone.stickit' : "../../bower_components/backbone.stickit/backbone.stickit",
    text : "../../bower_components/requirejs-text/text",
    baseModel: "models/baseModel",
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
    },
    "jquery.mockjax": {
      deps: ['jquery']
    },
    "backbone.stickit": {
      deps: ['backbone']
    }
  }
});

require(["app"]);