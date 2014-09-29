(function ($, COSTANTS) {

    $(document).ready(function () {

        $.ajaxSetup({
            headers: { "X-CSRFToken": COSTANTS.csrft_token}
        });

        $.pjax.defaults.timeout = 3000;

        $(document).pjax('a[data-pjax], a.pjax', '#container');

    });

})(jQuery, CONSTANTS)

