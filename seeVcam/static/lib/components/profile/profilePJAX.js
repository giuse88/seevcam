define(function (require) {

  var LoadingBar = require("nanobar");
  var $ = require("jquery");
  var Utils = require("utils");
  var Overlay = require("misc/overlay/overlay");

  var profileFragment = "profile";

  /*
    This is quite discussing code. This has to be rewritten.
   */

  function installPjaxForProfilePage() {

    $.pjax.defaults.timeout = 3000;
    var overlay = new Overlay();

    function profile_pjax_end(a, xhr, options) {
      if (options.container.hasClass("container")) {
        LoadingBar.go(100);
      }
      overlay.remove();
    }

    $(document).on('click', 'a[data-pjax="container"].profile-link', function(event) {
      var currentFragment = Backbone.history.fragment;

      /* This is the router for the profile page */
      if (currentFragment && currentFragment.indexOf(profileFragment) > -1) {
        event.preventDefault();
        return;
      }

      // Reset old view
      Utils.safelyUpdateCurrentView();
      var navbarElement = $('.navbar-nav *[data-route="profile"]');
      Utils.updateActiveLink(navbarElement);
      // hack to make pjax working with backbone
      Backbone.history.fragment = profileFragment;
      LoadingBar.go(10);
      $.pjax.click(event, {
        container: $("#container"),
        pjax_end: profile_pjax_end
      });
    });

    $(document).on('click', '.profile-container a[data-pjax="inner-container"]', function(event) {
      $.pjax.click(event, {
        container: $(".inner-container"),
        pjax_end: profile_pjax_end
      });
      $(".profile-options .active").removeClass("active");
      $(event.target).addClass("active");
    });


    $(document).on('submit', '.profile-container form[data-pjax]', function(event) {
      $.pjax.submit(event, '.inner-container');
      $(".inner-container .panel-body").prepend(overlay.render().$el);
    });

  }

  return {
    installPjaxForProfilePage : installPjaxForProfilePage
  }

});

