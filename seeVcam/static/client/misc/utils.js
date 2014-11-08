define(function(require){

  var notification = require("notification");

  function url_parser(url) {
    var parser = document.createElement('a');
    parser.href = url;
    return parser
  }

  function syncSuccess(value){
      // this function is called every we sync with the remote server
      console.log(value);
  }

  function syncError(model, response){
      var message = "Synchronization failed!";
      console.error(message);
      console.log(response.responseText);
      console.log(model);
      notification.error(message, "Re-loading the page might fix this problem.");
  }

  return {
    url_parser : url_parser,
    syncError : syncError,
    syncSuccess : syncSuccess
  }
});

