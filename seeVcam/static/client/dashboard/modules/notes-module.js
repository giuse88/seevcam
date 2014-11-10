//REPORTS NOTES VIEW
(function($){

	$(document).ready(function () {

		initNotesView()
        $(document).on('pjax:complete', function() {initNotesView()})

        function initNotesView(){
        	if ($('#notes-donut-chart').length) $('#notes-donut-chart').circliful()
        }

	})



})(jQuery)