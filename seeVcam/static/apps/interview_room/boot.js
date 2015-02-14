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
    presenters:   "lib/presenters",
    behaviors:    "lib/behaviors",
    templates:    "lib/templates",

    underscore : "bower_components/underscore/underscore",
    bootstrap   : "bower_components/bootstrap/dist/js/bootstrap",
    moment: "bower_components/moment/moment",
    jquery      : "bower_components/jquery/dist/jquery",
    'jquery.textarea.autoresize' : "bower_components/jquery.textarea.autoresize/js/jquery.textarea.autoresize",
    'jquery.mockjax' : "bower_components/jquery-mockjax/jquery.mockjax",
    'slimscroll': "bower_components/slimScroll/jquery.slimscroll",
    backbone : "bower_components/backbone/backbone",
    'backbone.stickit' : "bower_components/backbone.stickit/backbone.stickit",
    'backbone.bootstrap-modal': "lib/misc/backbone.bootstrap-modal",

    baseModel:    "lib/InterviewRoom/src/js/models/baseModel",
    baseView:     "lib/InterviewRoom/src/js/views/baseView",

    navigator :   "lib/InterviewRoom/src/js/views/navigator",

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
    }
  }
});

require(["lib/apps/interview_room/interview_room"]);