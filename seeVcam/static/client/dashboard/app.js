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

  /* extending pjax library */

  $(document).on('pjax:succeess', function(event, data, status, xhr, options) {
    if(typeof options.pjax_success === 'function'){
      options.pjax_success.apply(this,arguments);
    }
  });

  $(document).on('pjax:end', function(event, xhr, options) {
    if(typeof options.pjax_end === 'function'){
      options.pjax_end.apply(this, arguments);
    }
  });

  // Profile page. This page works with pjax.
  //profile.installPjaxForProfilePage();

  window.app = {
    name : "SeeVcam",
    router : router
  };

});
