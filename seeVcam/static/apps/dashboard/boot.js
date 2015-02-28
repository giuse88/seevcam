require.config({
  baseUrl: '/static/',
  waitSeconds: 200,

  paths: {
    "text" : "bower_components/requirejs-text/text",
    //apps
    "dashboard"     : "lib/app/dashboard/dashboard",
    // maps
    "models"        : "lib/models",
    "misc"          : "lib/misc",
    "components"    : "lib/components",
    "collections"   : "lib/collections",
    presenters    : "lib/presenters",
    behaviors     : "lib/behaviors",
    "services"      : "lib/services",

    // helpers
    navigator :   "lib/components/interview_room/navigator",

    // misc
    baseModel:    "lib/misc/baseModel",
    baseView:     "lib/misc/baseView",
    //libs
    "jquery"        : "bower_components/jquery/dist/jquery",
    "jquery-pjax"   : "bower_components/jquery-pjax/jquery.pjax",
    "jquery-ui"     : "bower_components/jquery-ui/jquery-ui",
    "jquery.ui.widget" : "bower_components/jquery-file-upload/js/vendor/jquery.ui.widget",
    "jquery-iframe-transport" :  "bower_components/jquery-file-upload/js/jquery.iframe-transport",
    "jquery.fileupload" : "bower_components/jquery-file-upload/js/jquery.fileupload",
    "jquery.fileupload-validate" : "bower_components/jquery-file-upload/js/jquery.fileupload-validate",
    "jquery.fileupload-process" : "bower_components/jquery-file-upload/js/jquery.fileupload-process",
    'jquery.textarea.autoresize' : "bower_components/jquery.textarea.autoresize/js/jquery.textarea.autoresize",
    'slimscroll': "bower_components/slimScroll/jquery.slimscroll",
    backbone : "bower_components/backbone/backbone",
    "circliful" : "bower_components/circliful/js/jquery.circliful",
    'backbone.stickit' : "bower_components/backbone.stickit/backbone.stickit",
    "underscore"    : "bower_components/underscore/underscore",
    "bootstrap"     : "bower_components/bootstrap/dist/js/bootstrap",
    "typeahead"     : "bower_components/typeahead.js/dist/typeahead.jquery",
    "bloodhound"    : "bower_components/typeahead.js/dist/bloodhound",
    "parsley"       : "bower_components/parsleyjs/dist/parsley",
    "fullcalendar"  : "bower_components/fullcalendar/dist/fullcalendar",
    "deep-model"    : "bower_components/backbone-deep-model/distribution/deep-model",
    "moment"        : "bower_components/moment/moment",
    "notification"  : "lib/components/notification/notification",
    "utils"         : "lib/misc/utils",
    "nanobar"       : "lib/misc/nanobar",
    "backbone-modal" : "lib/misc/backbone-modal"
  },

  shim: {

    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },

    "backbone.boostrap-modal" : {
      deps : ["backbone"]
    },

    "jquery-ui":{
      deps : ["jquery"]
    },

    "backbone.stickit": {
      deps: ['backbone']
    },

    "circliful" : {
      deps: ["jquery"]
    },

    "jquery-pjax":{
      deps : ["jquery"]
    },
    "parsley":{
      deps : ["jquery"]
    },
    "bloodhound" : {
       deps : ["jquery"]
    },
    "typeahead":{
      deps : ["jquery", "bloodhound"]
    },
    "bootstrap": {
      deps: ["jquery"]
    },

    "underscore": {
      deps: [],
      exports: "_"
    },
    "notification":{
      deps:["bootstrap"]
    },
    "fullcalendar":{
      deps:["jquery"]
    },
    "deep-model":{
      deps:["backbone"]
    },
    "jquery.textarea.autoresize": {
      deps: ['jquery']
    },
    "slimscroll": {
      deps: ['jquery']
    }
  }
});

require(["apps/dashboard/dashboard"]);