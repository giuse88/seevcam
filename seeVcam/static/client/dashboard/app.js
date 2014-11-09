define(function (require) {

  require("jquery-pjax");
  require("bootstrap");
  require("jquery-ui");

  var $ = require("jquery");
  var router = require("dashboard/router");
  var Nanobar = require("nanobar");

  $.ajaxSetup({
    headers: { "X-CSRFToken": window.CONSTANTS.csrft_token}
  });

  $.pjax.defaults.timeout = 3000;

  $(document).pjax('a[data-pjax], a.pjax, .pjax', '#container');
  $(document).on('submit', 'form[data-pjax]', function(event) {
    $.pjax.submit(event, '#container')
  });

  var loadingBar = new Nanobar({
    bg: '#e45000',
    target: document.getElementById('nanobar-container'),
    id: 'seevcam-nanobar'
  });

  window.app = {
    name : "SeeVcam",
    router : router,
    loadingBar :loadingBar
  };

});

