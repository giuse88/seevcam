(function ($, COSTANTS) {

    $(document).ready(function () {

        $.pjax.defaults.timeout = 3000;


        $(document).pjax('a.pjax', '#container');
//        $(document).on('submit', 'form', function (event) {
//            event.preventDefault();
//            console.log("submit");
//            $.pjax.submit(event, '#container')
//        })
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
            $('.list-group-item.active').removeClass('active');
            $(this).parent('li').addClass('active');
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
                url: window.location.pathname + 'create_question/' ,
                container: '#list',
                push: false,
                data: {'question_text': $('#new-question').val()},
                success: function (i) {
                    console.log(i);
                }

            })
        });

        $('#container').on('click', 'a.delete', function (event) {
            var container = "#catalogue"
            var current_item_id = window.location.pathname.split("/")[3];
            var deleted_item_id = $(this).attr('href').split("/")[4];
            if ( current_item_id === deleted_item_id)
                container = "#container"
            event.preventDefault();
            $.pjax({
                type: 'POST',
                url: $(this).attr('href'),
                container: container,
                push:true
            })
        });


        $('#container').on('click', 'a.update', function (event) {
            event.preventDefault();
            var value = $(this).siblings('.catalogue').text().trim();
            var href = $(this).siblings('.catalogue').attr('href');
            // TODO use a template
            var url_parsed = UTILS.url_parser(href);
            href = url_parsed.pathname + 'update/'
            var inputHTML= '' +
                '<form id="update-catalogue-form" class="input-group " action="' + href + '">' +
                    '<input type="text" value="' + value +'" class="form-control">' +
                    '<button class="btn btn-default" type="submit">Update</button>' +
                '</form>'
            $(this).parent('li').html(inputHTML)
        });

        $('#container').on('submit', '#update-catalogue-form', function (event) {
            event.preventDefault();
            var container = "#catalogue"
            var url = $(this).attr('action');
            var current_item_id = window.location.pathname.split("/")[3];
            var updated_item_id = url.split("/")[3];
            debugger
            if ( current_item_id === updated_item_id)
                container = "#container"
            var text = $(this).children(':input').val();
            $.pjax({
                type: 'POST',
                url: url,
                container: container,
                push:false,
                data: {'catalogue_name': text}
            })
        });

        $(document).on('pjax:complete', function() {
            console.log(this)
        })

        console.log("Configuration completed.")
    });

})(jQuery, CONSTANTS)