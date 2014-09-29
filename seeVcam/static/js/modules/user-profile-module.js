http://lesscss.org/

    $("#container").on("pjax:success", "#profile-content", function (event, data, status, xhr, options) {
            $("a.profile").removeClass("active");
            options.activeButton.addClass("active");
        });