define(function (require) {

  require("jquery-pjax");
  require("bootstrap");
  require("jquery-ui");

  var $ = require("jquery");
  var router = require("dashboard/router");
  var profile = require("modules/profile/profilePjax");

  $.ajaxSetup({
    headers: { "X-CSRFToken": window.CONSTANTS.csrft_token}
  });

  // Profile page. This page works with pjax.
  profile.installPjaxForProfilePage();

  window.app = {
    name : "SeeVcam",
    router : router
  };

});
