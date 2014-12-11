define(function (require) {

  var _ = require("underscore");
  var Backbone = require("backbone");

  return  Backbone.View.extend({

    tagName : 'div',
    className : 'clock',

    template: _.template('' +
      '<div class="col-md-3" id="current-datetime-container"> ' +
      ' <div id="current-datetime"> ' +
      ' <div class="interview-date"> ' +
      ' <span class="date-day"><%= day %></span> ' +
      ' <span class="date-separator">/</span> ' +
      ' <span class="date-month"><%= month %> </span> ' +
      ' <span class="date-separator">/</span>  ' +
      ' <span class="date-year"><%= year %></span> ' +
      ' </div> ' +
      ' <div class="interview-time"> ' +
      '<span class="date-day"><%= hour %></span> ' +
      '<span class="date-separator">:</span> ' +
      '<span class="date-minute"><%= minute %> </span> ' +
      '<div id="am-pm"> ' +
      '  <span class="<%= am_active %>">AM</span> ' +
      '  <span class="<%= pm_active %>">PM</span> ' +
      '</div> ' +
      '</div> ' +
      '</div> '),

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