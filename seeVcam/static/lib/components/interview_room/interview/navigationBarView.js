define(function (require) {
  var BaseView = require('baseView');
  var Navigator = require("navigator");

  return BaseView.extend({
    events : {
      'click a' : "goTo"
    },

    template: require('text!./templates/navigation-bar.html'),

    goTo : function (e) {
      console.log(this);
      e.preventDefault();
      var route = $(e.currentTarget).data("route");
      Navigator.interviewGoTo(route || "questions");
    }
  });
});