define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  return  Backbone.View.extend({

  });

});

/*

  function interviewsCalendarInit(){
            $('#interviews-calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                editable: true,
                droppable: true,
                allDaySlot: true,
                events: calendarEvents, //see interviews-calendar.html template
                dayClick: function(date, allDay, jsEvent, view) {
                    if (allDay){
                        //switch to agendaDay
                        $('#interviews-calendar').fullCalendar('changeView','agendaDay');
                        $('#interviews-calendar').fullCalendar('gotoDate',date.getFullYear(),date.getMonth(),date.getDate());
                    }
                },
                eventClick: function(ev,jsev,view){
                    if (view.name=="month") {
                        //go to agendaDay view
                        $('#interviews-calendar').fullCalendar('changeView','agendaDay');
                        $('#interviews-calendar').fullCalendar('gotoDate',ev.start.getFullYear(),ev.start.getMonth(),ev.start.getDate());
                    }
                }
            })
        }

*/