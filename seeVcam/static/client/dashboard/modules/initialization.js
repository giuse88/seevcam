(function ($, COSTANTS) {

    $(document).ready(function () {



        // INTERVIEWS CALENDAR VIEW
        if ($('#interviews-calendar').length) interviewsCalendarInit()
        $(document).on('pjax:end', function() {
            if ($('#interviews-calendar').length) interviewsCalendarInit()
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

