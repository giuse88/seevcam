define(function (require) {

  var $ = require("jquery");

  require("jquery-pjax");
  require("bootstrap");
  // To be removed
  require("notification");

  $.ajaxSetup({
    headers: { "X-CSRFToken": window.CONSTANTS.csrft_token}
  });

  $.pjax.defaults.timeout = 3000;

  $(document).pjax('a[data-pjax], a.pjax, .pjax', '#container');
  $(document).on('submit', 'form[data-pjax]', function(event) {
    $.pjax.submit(event, '#container')
  });

  window.app = {
    name : "SeeVcam"
  };

});

