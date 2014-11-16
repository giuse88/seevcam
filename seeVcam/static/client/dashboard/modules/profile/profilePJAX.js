define(function (require) {

  var LoadingBar = require("nanobar");
  var $ = require("jquery");
  var Utils = require("utils");

  var profileFragment = "profile";

  /*
    This is quite discussing code. This has to be rewritten.
   */

  function installPjaxForProfilePage() {

    $.pjax.defaults.timeout = 3000;

    $(document).on('click', 'a[data-pjax="container"].profile-link', function(event) {

      if (Backbone.history.fragment.indexOf(profileFragment) > -1) {
        event.preventDefault();
        return;
      }

      var navbarElement = $('.navbar-nav *[data-route="profile"]');
      Utils.updateActiveLink(navbarElement);
      // hack to make pjax working with backbone
      Backbone.history.fragment = profileFragment;
      LoadingBar.go(10);
      $.pjax.click(event, {container: $("#container")});
    });

    $(document).on('click', '.profile-container a[data-pjax="inner-container"]', function(event) {
      $.pjax.click(event, {container: $(".inner-container")});
      $(".profile-options .active").removeClass("active");
      $(event.target).addClass("active");
    });

    $(document).on('pjax:end', function(a, xhr, options) {
      if (options.container.hasClass("container"))
        LoadingBar.go(100);
    });

    $(document).on('submit', '.profile-container form[data-pjax]', function(event) {
      $.pjax.submit(event, '.inner-container')
    });

  }

  return {
    installPjaxForProfilePage : installPjaxForProfilePage
  }

});

