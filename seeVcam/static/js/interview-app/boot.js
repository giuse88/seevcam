require.config({
  baseUrl: '/static/bower_components/',
  paths: {
    // App.js
    app : "../js/interview-app/app",
    // lib
    jquery : "jquery/dist/jquery"
    // modules
  }
});
// kick off the app
require(["app"]);