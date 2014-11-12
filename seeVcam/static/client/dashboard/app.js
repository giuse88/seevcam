define(function (require) {

  require("jquery-pjax");
  require("bootstrap");
  require("jquery-ui");

  var $ = require("jquery");
  var router = require("dashboard/router");

  $.ajaxSetup({
    headers: { "X-CSRFToken": window.CONSTANTS.csrft_token}
  });

  $.pjax.defaults.timeout = 3000;


  $(document).pjax('a[data-pjax="container"]', '#container');
  $(document).pjax('a[data-pjax="inner-container"]', '.inner-container');

  window.app = {
    name : "SeeVcam",
    router : router
  };

});

