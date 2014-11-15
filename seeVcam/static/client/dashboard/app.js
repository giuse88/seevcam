define(function (require) {

  require("jquery-pjax");
  require("bootstrap");
  require("jquery-ui");

  var Utils = require("utils");
  var LoadingBar = require("nanobar");
  var $ = require("jquery");
  var router = require("dashboard/router");

  $.ajaxSetup({
    headers: { "X-CSRFToken": window.CONSTANTS.csrft_token}
  });

  $.pjax.defaults.timeout = 3000;


  $(document).pjax('a[data-pjax="container"]', '#container');
  $(document).pjax('a[data-pjax="inner-container"]', '.inner-container');
  $(document).on('pjax:send', function(a, xhr, options) {
    if (options.container.hasClass("container"))
      LoadingBar.go(10);
  });
  $(document).on('pjax:end', function(a, xhr, options) {
      if (options.container.hasClass("container"))
        LoadingBar.go(100);
  });

  $(".dropdown-menu.pjax-links ").find("li a").click(function(event){
    Utils.updateActiveLink($(event.currentTarget));
  });

  window.app = {
    name : "SeeVcam",
    router : router
  };

});

