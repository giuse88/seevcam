require.config({

  baseUrl: '/static/',
  paths: {

    // App.js
    app : "client/InterviewRoom/src/js/app",

    bootstrap   : "bower_components/bootstrap/dist/js/bootstrap",
    jquery      : "bower_components/jquery/dist/jquery",
    'jquery.textarea.autoresize' : "bower_components/jquery.textarea.autoresize/js/jquery.textarea.autoresize",
    'jquery.mockjax' : "bower_components/jquery-mockjax/jquery.mockjax",
    'slimscroll': "bower_components/slimScroll/jquery.slimscroll",
    underscore : "bower_components/underscore/underscore",
    moment: "bower_components/moment/moment",
    backbone : "bower_components/backbone/backbone",
    'backbone.stickit' : "bower_components/backbone.stickit/backbone.stickit",
    text : "bower_components/requirejs-text/text",

    baseModel:    "client/InterviewRoom/src/js/models/baseModel",
    baseView:     "client/InterviewRoom/src/js/views/baseView",
    navigator :   "client/InterviewRoom/src/js/views/navigator",
    models:       "client/InterviewRoom/src/js/models",
    collections:  "client/InterviewRoom/src/js/collections",
    presenters:   "client/InterviewRoom/src/js/presenters",
    views:        "client/InterviewRoom/src/js/views",
    services:     "client/InterviewRoom/src/js/services",
    behaviors:    "client/InterviewRoom/src/js/behaviors",
    templates:    "client/InterviewRoom/src/js/templates",
    opentok:      "client/vendor/opentok.min",

    'backbone.bootstrap-modal': "client/misc/backbone.bootstrap-modal"
  },

  shim: {
    "bootstrap" : {
      deps: ["jquery"]
    },
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