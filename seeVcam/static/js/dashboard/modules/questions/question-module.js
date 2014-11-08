(function questionModule(notification) {

















    window.catalogueList = null;
    window.catalogueViewList = null;

    function installCataloguePicker() {
    }

    function installQuestionModule() {
        console.log("Installing question dashboard");

//        $('#create-catalogue input').keypress(function(e) {
//            if(e.which == 13 && $(this).val()) {
//                var new_catalogue = {"catalogue_name": $(this).val(), "scope": "PRIVATE"};
//                var self = this;
//                $.post("/dashboard/questions/catalogue/", new_catalogue, function(catalogue){
//                    if (window.openCatalogue){
//                        window.openCatalogue.close();
//                    }
//                    $(self).val('');
//                    var list=new apps.List([catalogue],{catalogue: catalogue});
//                    window.openCatalogue = new apps.ListView(list) ;
//                    console.log(catalogue);
//                }, "json").fail(function(jxhr) {
//                    console.log("Creation catalogue failed. Reason :" + jxhr.responseText);
//                });
//            }
//        });
        installCataloguePicker();
        console.log("Question dashboard installed.");
    }

    window.questionCenter = {
        install: installQuestionModule
    };

})(window.notification);

