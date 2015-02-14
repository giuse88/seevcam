require.config({

  baseUrl: '/static/',
  paths: {

    // plugin
    text : "bower_components/requirejs-text/text",

    // App.js
    app : "lib/apps/interview_room/interview_room",

    // mappings
    models        : "lib/models",
    misc          : "lib/misc",
    components    : "lib/components",
    collections   : "lib/collections",
    services      : "lib/services",
    presenters    : "lib/presenters",
    behaviors     : "lib/behaviors",
    templates     : "lib/templates",

    // helpers
    navigator :   "lib/components/interview_room/navigator",

    // libs
    underscore : "bower_components/underscore/underscore",
    bootstrap   : "bower_components/bootstrap/dist/js/bootstrap",
    moment      : "bower_components/moment/moment",
    jquery      : "bower_components/jquery/dist/jquery",
    'jquery.textarea.autoresize' : "bower_components/jquery.textarea.autoresize/js/jquery.textarea.autoresize",
    'jquery.mockjax' : "bower_components/jquery-mockjax/jquery.mockjax",
    'slimscroll': "bower_components/slimScroll/jquery.slimscroll",
    backbone : "bower_components/backbone/backbone",
    'backbone.stickit' : "bower_components/backbone.stickit/backbone.stickit",
    "deep-model"    : "bower_components/backbone-deep-model/distribution/deep-model",
    'backbone-modal': "lib/misc/backbone-modal",

    // misc
    baseModel:    "lib/misc/baseModel",
    baseView:     "lib/misc/baseView",
    opentok:      "lib/vendor/opentok.min"

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
    },
    "deep-model": {
      deps:["backbone"]
    }
  }
});

require(["apps/interview_room/interview_room"]);