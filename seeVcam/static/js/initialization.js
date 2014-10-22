(function ($, COSTANTS) {

    $(document).ready(function () {

        $.ajaxSetup({
            headers: { "X-CSRFToken": COSTANTS.csrft_token}
        });

        $.pjax.defaults.timeout = 3000;

        $(document).pjax('a[data-pjax], a.pjax, .pjax', '#container');


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


        $(document).on('submit', 'form[data-pjax]', function(event) {
            $.pjax.submit(event, '#container')
        })

        // REPORTS VIEW
        // bind click to note view
        if ($('.report-item').length) bindReportItemClick()
        $(document).on('pjax:end', function() {
            if ($('.report-item').length) bindReportItemClick()
        })
        
        function bindReportItemClick(ev){
            $('.report-item').each(function(i,el){
                $(el).click(function(ev){
                    var id = ev.currentTarget.id.split('-')[1]
                    $.pjax({url: '/dashboard/reports/'+id+'/notes/list', container: '#container'})
                })
            })
        }
    });

})(jQuery, CONSTANTS)

