define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  require("fullcalendar");


  return  Backbone.View.extend({

    tagName : 'div',
    className : 'interviews-calendar',

    render : function() {
      _.defer(this.renderCalendar.bind(this));
      return this;
      },

    renderCalendar : function() {
      var self = this;
      this.$el.fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },
        editable: false,
        droppable: false,
        allDaySlot: true,
        events: [],
        dayClick: function(date, allDay, jsEvent, view) {
          if (allDay){
            self.$el.fullCalendar('changeView','agendaDay');
            self.$el.fullCalendar('gotoDate',date.getFullYear(),date.getMonth(),date.getDate());
          }
        },
        eventClick: function(ev,jsev,view){
          if (view.name=="month") {
            self.$el.fullCalendar('changeView','agendaDay');
            self.$el.fullCalendar('gotoDate',ev.start.getFullYear(),ev.start.getMonth(),ev.start.getDate());
          }
        }
      });
    }
  });
});

