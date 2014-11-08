require.config({
  baseUrl: '/static/',
  paths: {
    // App.js
    "app" : "js/dashboard/app",
    // maps
    "modules"       : "js/dashboard/modules",
    "dashboard"     : "js/dashboard/",
    //libs
    "jquery"        : "bower_components/jquery/dist/jquery",
    "jquery-pjax"   : "bower_components/jquery-pjax/jquery.pjax",
    "jquery-ui"     : "bower_components/jquery-ui/jquery-ui",
    "backbone"      : "bower_components/backbone/backbone",
    "underscore"    : "bower_components/underscore/underscore",
    "bootstrap"     : "bower_components/bootstrap/dist/js/bootstrap",
    //
    "notification"  : "js/dashboard/modules/notification/notification",
    "utils"         : "js/misc/utils"
  },

  shim: {
    "jquery-ui":{
      deps : ["jquery"]
    },
    "jquery-pjax":{
      deps : ["jquery"]
    },
    "bootstrap": {
      deps: ["jquery"]
    },
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "underscore": {
      deps: [],
      exports: "_"
    },
    "notification":{
      deps:["bootstrap"]
    }
  }
});
// Kick off the app
require(["app"]);