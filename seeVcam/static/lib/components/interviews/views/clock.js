define(function (require) {

  var _ = require("underscore");
  var Backbone = require("backbone");
	var clockTemplate = require("text!../templates/clock.html");


	return  Backbone.View.extend({

    tagName : 'div',
    className : 'clock',

    template: _.template(clockTemplate),

    getTemplateData : function () {
      var now = new Date();
      var hour =  now.getHours();
      var minutes = now.getMinutes();
      var pm  = hour > 11 ? true : false;
      return {
        hour: pm ? hour-12 : hour ,
        minute: (minutes <10) ? ('0'+minutes) : minutes,
        day: now.getDay(),
        month: now.getMonth() + 1,
        year: now.getUTCFullYear(),
        am_active: pm ? "" : "active",
        pm_active: pm ? "active" : ""
      }
    },

    render: function() {
      this.$el.html(this.template(this.getTemplateData()));
      this.timer = setTimeout(this.render.bind(this), 60000);
      return this;
    },

    close: function (){
      clearTimeout(this.timer);
      this.remove();
      this.unbind();
      this.undelegateEvents();
    }

  });

});