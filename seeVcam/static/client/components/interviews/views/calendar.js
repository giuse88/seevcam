define(function (require) {

  require("fullcalendar");

  var _ = require("underscore");
  var Backbone = require("backbone");
  var moment = require("moment");

  return  Backbone.View.extend({

    tagName : 'div',
    className : 'interviews-calendar',

    initialize : function(options) {

      var self = this;
      this.options = options;
      this.collection = options.collection;
      var currentInterview = this.options.interview;
      var currentEventID = undefined;
      var events = self.getBackgroundEvents().concat(self.getEvents());

      if ( currentInterview &&  !_.isEmpty(currentInterview)){
        this.startDateTime = moment(currentInterview.get('start')).local();
        this.endDateTime = moment(currentInterview.get('end')).local();
      }

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
        timezone : 'local',
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

            console.log(date);

            self.updateInternalDates(moment(date),
                                     moment(date).add(1, 'hours'));

            if (!!currentEventID) {
              self.$el.fullCalendar('removeEvents', currentEventID);
            }
            var eventObj = {
              title:"New Interview",
              start:self.startDateTime,
              end: self.endDateTime,
              allDay:false,
              editable:true,
              currentEvent:true,
              color: 'red'
            };
            self.$el.fullCalendar('renderEvent', eventObj, true);
          }
        },

        eventResize: function(event, delta, revertFunc) {
          self.updateInternalDates(event.start, event.end);
        },

        eventDrop: function (event, delta, revertFunc, jsEvent, ui, view ) {
          self.updateInternalDates(event.start, event.end);
         }

      });
    },

    start : function () {
     return this.startDateTime.clone().utc();
    },

    end : function(){
      return this.endDateTime.clone().utc();
    },

    updateInternalDates : function(start, end) {
      console.log(start.format());
      this.startDateTime= start;
      this.endDateTime = end;
      console.log(this.startDateTime.format());
      if (this.options.interview) {
        var currentInterview = this.options.interview;
        currentInterview.set('start', this.startDateTime);
        currentInterview.set('end', this.endDateTime);
      }
    },

    getBackgroundEvents: function () {
      var firstDay = moment()
                      .startOf('month')
                      .subtract(1, 'week');
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
      var currentInterview = this.options.interview;
      this.collection.each(function(interview)  {
        var event = interview.toCalendarEvent();
        if ( currentInterview &&  !_.isEmpty(currentInterview) &&
             event.id === currentInterview.get('id')){
          event.editable= true;
          event.currentEvent = true;
          event.color = 'red';
          // converts to the user timezone
          event.start = moment(currentInterview.get('start'));
          event.end = moment(currentInterview.get('end'));
        }
        events.push(event);
      },this);
      return events;
    },

    renderCalendar : function() {
      this.$el.fullCalendar('render');
    }
  });
});

