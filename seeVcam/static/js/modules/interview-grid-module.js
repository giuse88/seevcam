(function($){

    function installInterviewGrid() {
        console.log("--- Installing grid system ---");
        installUpdateView();
        installDeleteView();
        console.log("--- Completed grid system ---");
    }

    function installUpdateView() {
        $(".interview-item").click(function(){
            var interviewId = $(this).attr("data-interview-id");
            var url = "/dashboard/interviews/update/" + interviewId + "/";
             $.pjax({url: url, container: '#container'})
        });
    }

    function installDeleteView() {}

    window.interviewGrid = {
        installInterviewGrid : installInterviewGrid
    };

})(jQuery);