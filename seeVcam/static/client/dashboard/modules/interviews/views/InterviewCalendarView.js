define(function (require) {

  require("fullcalendar");

  var _ = require("underscore");
  var Backbone = require("backbone");

  return  Backbone.View.extend({

    tagName : 'div',
    className : 'interviews-calendar',

    initialize : function(options) {

      var self = this;
      this.options = options;
      this.collection = options.collection;
      var currentEventID = undefined;
      var events = self.getBackgroundEvents().concat(self.getEvents());

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

        dayClick: function(date, jsEvent, view) {

          if (date.isBefore(moment())) {
            return;
          }

          if (!date.hasTime()){
            self.$el.fullCalendar('changeView','agendaDay');
            self.$el.fullCalendar('gotoDate',date);
          } else if (!self.options.readOnly) {

            var startDateTime = moment(date);
            var endDateTime = moment(date).add(1, 'hours');

            if (!!currentEventID) {
              self.$el.fullCalendar('removeEvents', currentEventID);
            }
            var eventObj = {
              title:"New Interview",
              start:startDateTime,
              end: endDateTime,
              allDay:false,
              editable:true,
              currentEvent:true,
              color: 'red'
            };
            self.$el.fullCalendar('renderEvent', eventObj, true);
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
      var end = moment();
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

