(function ($, COSTANTS) {

    $(document).ready(function () {

        $.ajaxSetup({
            headers: { "X-CSRFToken": COSTANTS.csrft_token}
        });

        $.pjax.defaults.timeout = 3000;

        $(document).pjax('a[data-pjax], a.pjax', '#container');


        // INTERVIEWS CALENDAR VIEW
        if ($('#interviews-calendar').length) interviewsCalendarInit()
        $(document).on('pjax:end', function() {

            if ($('#interviews-calendar').length) interviewsCalendarInit()
        })

        function interviewsCalendarInit(){
            $('#interviews-calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                // height: height,
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
                },
            })
        }

        //bind remove button in interviews view
        if ($('.interview-item .glyphicon-remove').length) bindInterviewsRemoveClick()
        $(document).on('pjax:end', function() {
            if ($('.interview-item .glyphicon-remove').length) bindInterviewsRemoveClick()
        })
        
        function bindInterviewsRemoveClick(ev){
            $('.interview-item .glyphicon-remove').each(function(i,el){
                $(el).click(function(ev){
                    $('.interview-item-container').has(ev.currentTarget).remove()
                })
            })
        }

        // INTERVIEW VIEW
//        $(document).on('submit', 'form[data-pjax]', function(event) {
//            $.pjax.submit(event, '#container')
//        })

    });

})(jQuery, CONSTANTS)

