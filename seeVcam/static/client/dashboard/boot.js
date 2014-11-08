require.config({
  baseUrl: '/static/',
  paths: {
    // App.js
    "app" : "client/dashboard/app",
    // maps
    "modules"       : "client/dashboard/modules",
    "dashboard"     : "client/dashboard/",
    //libs
    "jquery"        : "bower_components/jquery/dist/jquery",
    "jquery-pjax"   : "bower_components/jquery-pjax/jquery.pjax",
    "jquery-ui"     : "bower_components/jquery-ui/jquery-ui",
    "backbone"      : "bower_components/backbone/backbone",
    "underscore"    : "bower_components/underscore/underscore",
    "bootstrap"     : "bower_components/bootstrap/dist/js/bootstrap",
    //
    "notification"  : "client/dashboard/modules/notification/notification",
    "utils"         : "client/misc/utils"
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