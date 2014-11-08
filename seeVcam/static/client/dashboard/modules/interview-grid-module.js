(function($){

    function installInterviewGrid() {
        console.log("--- Installing grid system ---");
        installUpdateView();
        installDeleteView();
        console.log("--- Completed grid system ---");
    }

    function installUpdateView() {
        $(".interview-item").click(function(event){
            event.preventDefault();
            var interviewId = $(this).attr("data-interview-id");
            var url = "/dashboard/interviews/update/" + interviewId + "/";
             $.pjax({url: url, container: '#container'})
        });
    }

    function installDeleteView() {

        $('.interview-item .glyphicon-remove').click(function(event){

            event.preventDefault();
            event.stopPropagation();

            var $target = $(this).parents(".interview-item");
            var id = $target.attr("data-interview-id");

            function successDelete(result){
                console.log(result);
                $target.parents(".interview-item-container").remove();
            }

            function failureDelete(error){
                console.log(error);
            }

            $.ajax({
                url: '/dashboard/interviews/delete/'+id+'/',
                type: 'DELETE'
            }).done(successDelete)
              .fail(failureDelete);
        });
    }

    window.interviewGrid = {
        installInterviewGrid : installInterviewGrid
    };

})(jQuery);