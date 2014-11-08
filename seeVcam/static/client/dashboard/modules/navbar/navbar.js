define(function (require) {

  var $ = require("jquery");
  var Router = require("dashboard/router");
  var $navigationBar = $(".navbar-nav");

  function updateActiveLink($selected){
    if ($selected.hasClass("active")){
      return;
    }
    $navigationBar.find("li .active").removeClass("active");
    $selected.addClass("active");
  }

  function navigator(){
    var route = $(this).data("route");
    // need to find a more elegant way
    if ( route === "question"){
      Router.QuestionsRouter.navigate("questions/", {trigger:true});
    }
    updateActiveLink($(this));
  }

  function install(){
    $(".navbar-link").click(navigator)
  }

  return {
    install : install
  }

});
