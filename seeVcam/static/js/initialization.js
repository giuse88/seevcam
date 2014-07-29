(function ($, COSTANTS) {

    $(document).ready(function () {

        $.pjax.defaults.timeout = 3000;


        $(document).pjax('a.pjax', '#container');
        $(document).on('submit', 'form', function (event) {
            event.preventDefault();
            console.log("submit");
            $.pjax.submit(event, '#container')
        })
        console.log("Pjax activated");

        $.ajaxSetup({
            headers: { "X-CSRFToken": COSTANTS.csrft_token}
        });


        $('#container').on('click', 'a.catalogue', function (event) {
            event.preventDefault();
            $.pjax({
                type: 'GET',
                url: $(this).attr('href'),
                container: '#list'
            })
        });

        $('#container').on('click', 'a.tabs', function (event) {
            event.preventDefault();
            console.log("ff");
            $.pjax({
                type: 'GET',
                url: $(this).attr('href'),
                container: '#container'
            })
        });

        $('#container').on('click', '#add-category', function (event) {
            event.preventDefault();
            $.pjax({
                type: 'POST',
                url: "/dashboard/questions/create/",
                container: '#container',
                data: {'catalogue_name': $('#new-category').val()},
                success: function (i) {
                    console.log(i);
                }
            })
        });

        $('#container').on('click', '#add-question', function (event) {
            event.preventDefault();
            $.pjax({
                type: 'POST',
                url: "/dashboard/questions/create/",
                container: '#list',
                data: {'catalogue_name': $('#new-question').val()},
                success: function (i) {
                    console.log(i);
                }
            })
        });

        $('#container').on('click', 'a.delete', function (event) {
            event.preventDefault();
            $.pjax({
                type: 'POST',
                url: $(this).attr('href'),
                container: '#catalogue',
                push:false
            })
        });

        $(document).on('pjax:complete', function() {
            console.log(this)
        })

        console.log("Configuration completed.")
    });

})(jQuery, CONSTANTS)