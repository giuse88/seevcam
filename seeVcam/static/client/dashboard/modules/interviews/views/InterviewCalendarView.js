define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  require("fullcalendar");


  return  Backbone.View.extend({

    tagName : 'div',
    className : 'interviews-calendar',

    initialize : function(options) {
      var self = this;
      this.collection = options.collection;
      var currentEventID = undefined;
      var events = self.getBackgroundEvents().concat(self.getEvents());
      console.log("Events");
      console.log(events);

      this.$el.fullCalendar({

        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month,agendaWeek,agendaDay'
        },

        columnFormat : {
          month: 'ddd',
          week: 'ddd D/M',
          day: 'dddd'
        },

        firstDay : 1, // Moday
        editable: false,
        droppable: false,
        eventOverlap : false,
        slotEventOverlap : false,
        allDaySlot: true,
        events: events,
        eventBackgroundColor: '#ddd',

        viewRender: function(view) {
          var tomorrow = moment().add(1,'d');
          var start = view.start;
          if(start.isBefore(tomorrow)) {
            self.$el.find('.fc-prev-button').addClass("fc-state-disabled");
          } else {
            self.$el.find('.fc-prev-button').removeClass("fc-state-disabled");
          }
        },

        eventRender: function(ev,element,view){
          if (ev.currentEvent){
            currentEventID = ev._id;
          }
        },

        dayClick: function(date, allDay, jsEvent, view) {
          if (allDay){
            self.$el.fullCalendar('changeView','agendaDay');
            self.$el.fullCalendar('gotoDate',date.getFullYear(),date.getMonth(),date.getDate());
          } else {
            var endDateTime = new Date(date.getTime() + 30*60000);
            var startDateTime = date;
            if (!!currentEventID)
              self.$el.fullCalendar('removeEvents',currentEventID);
            var eventObj = {
              title:"New Interview",
              start:startDateTime,
              end: endDateTime,
              allDay:false,
              editable:true,
              currentEvent:true,
              color: 'red'
            };
            self.$el.fullCalendar('renderEvent',eventObj,true);
          }
        },

        eventClick: function(ev,jsev,view){
          if (view.name=="month") {
            self.$el.fullCalendar('changeView','agendaDay');
            self.$el.fullCalendar('gotoDate',ev.start.getFullYear(),ev.start.getMonth(),ev.start.getDate());
          }
        }
      });
    },

    getBackgroundEvents: function () {
      var firstDay = moment().
                      startOf('month').
                      subtract(1, 'week');
      var end = moment()
                  .subtract(1,'day')
                  .endOf('day');
      var events = [];

      // all day from first day to last day
      events.push({
        editable:false,
        start: firstDay,
        end: end,
        allDay:true,
        overlap :false,
        rendering: 'background'
      });

      // Yestarday all day view
      events.push({
        editable:false,
        start:end,
        end:moment(),
        allDay:true,
        overlap :false,
        rendering: 'background'
      });

      // agenda/day view from first day to last day
      events.push({
        start: firstDay,
        end: end,
        overlap :false,
        rendering: 'background'
      });

      return events;
    },

    render : function() {
      _.defer(this.renderCalendar.bind(this));
      return this;
    },

    getEvents : function () {
      var events = [];
      this.collection.each(function(interview)  {
        events.push(interview.toCalendarEvent());
      });
      return events;
    },

    renderCalendar : function() {
      this.$el.fullCalendar('render');
    }
  });
});

