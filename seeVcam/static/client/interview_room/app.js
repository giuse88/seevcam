define(function (require) {

  var $ = require("jquery");
  var SeevcamSession = require("modules/video/models/seevcam_session");


  // Video Session
  var seevcamSession = new SeevcamSession({
    apyKey : apiKey,
    sessionId : sessionId,
    token : token
  });



  window.app = {
    name : "SeeVcam",
    session : seevcamSession
  };

});

