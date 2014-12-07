require.config({
  baseUrl: '/static/',
  paths: {
    // App.js
    "app" : "client/dashboard/app",
    // maps
    "modules"       : "client/dashboard/modules",
    "dashboard"     : "client/dashboard/",
    "misc"          : "client/misc",
    //libs
    "jquery"        : "bower_components/jquery/dist/jquery",
    "jquery-pjax"   : "bower_components/jquery-pjax/jquery.pjax",
    "jquery-ui"     : "bower_components/jquery-ui/jquery-ui",
    "jquery.ui.widget" : "bower_components/jquery-file-upload/js/vendor/jquery.ui.widget",
    "jquery-iframe-transport" :  "bower_components/jquery-file-upload/js/jquery.iframe-transport",
    "jquery-fileupload" : "bower_components/jquery-file-upload/js/jquery.fileupload",
    "backbone"      : "bower_components/backbone/backbone",
    "underscore"    : "bower_components/underscore/underscore",
    "bootstrap"     : "bower_components/bootstrap/dist/js/bootstrap",
    "typeahead"     : "bower_components/typeahead.js/dist/typeahead.jquery",
    "bloodhound"    : "bower_components/typeahead.js/dist/bloodhound",
    "parsley"       : "bower_components/parsleyjs/dist/parsley",
    "fullcalendar"  : "bower_components/fullcalendar/fullcalendar",
    //
    "notification"  : "client/dashboard/modules/notification/notification",
    "utils"         : "client/misc/utils",
    "nanobar"       : "client/misc/nanobar"
  },

  shim: {
    "jquery-ui":{
      deps : ["jquery"]
    },
    "jquery-ui-widget" : {
      deps : ["jquery-ui"]
    },
    "jquery-iframe-transport" : {
      deps : ["jquery"]
    },
    "jquery-fileupload" : {
      deps : ["jquery-iframe-transport", "jquery.ui.widget"]
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
    },
    "fullcalendar":{
      deps:["jquery"]
    }
  }
});
// Kick off the app
require(["app"]);