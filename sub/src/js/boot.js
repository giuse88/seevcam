require.config({

  baseUrl: './src/js',
  paths: {
    // App.js
    app : "./app",
    // lib
    bootstrap : "../../bower_components/bootstrap/dist/js/bootstrap",
    jquery : "../../bower_components/jquery/dist/jquery",
    'jquery.textarea.autoresize' : "../../bower_components/jquery.textarea.autoresize/js/jquery.textarea.autoresize",
    'jquery.mockjax' : "../../bower_components/jquery-mockjax/jquery.mockjax",
    'slimscroll': "../../bower_components/slimScroll/jquery.slimscroll",
    underscore : "../../bower_components/underscore/underscore",
    moment: "../../bower_components/momentjs/moment",
    backbone : "../../bower_components/backbone/backbone",
    'backbone.bootstrap-modal': "../vendor/backbone.bootstrap-modal",
    'backbone.stickit' : "../../bower_components/backbone.stickit/backbone.stickit",
    text : "../../bower_components/requirejs-text/text",
    baseModel: "models/baseModel",
    baseView: "views/baseView",
    models: "models",
    collections: "collections",
    presenters: "presenters",
    views: "views",
    services: "services"
  },
  shim: {
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "backbone.stickit": {
      deps: ['backbone']
    },
    "backbone.bootstrap-modal": {
      deps: ['backbone']
    },
    "jquery" : {
      deps: [],
      exports: "$"
    },
    "slimscroll": {
      deps: ['jquery']
    },
    "jquery.textarea.autoresize": {
      deps: ['jquery']
    },
    "jquery.mockjax": {
      deps: ['jquery']
    },
    "underscore": {
      deps: [],
      exports: "_"
    }
  }
});

require(["app"]);