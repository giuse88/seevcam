(function($) {

    /****************************************************************
     *                        Constructor                           *
     ****************************************************************/

    function installCreateInterviewModule(){
        console.log(" -- Create interview beginning constructor --  ");
        installParsley();
        installTypeAhead();
        installToolTip();
        console.log(" -- Create interview end constructor --  ");
    }

    /****************************************************************
     *                        Private methods                       *
     ****************************************************************/

    function installToolTip(){
        $('[data-toggle="tooltip"]').tooltip({container: 'body'});
    }

    function installParsley() {
        $('.create-interview form').parsley({
            errorClass: 'has-error',
            classHandler: function (el) {
                return el.$element.closest('.form-group');
            },
            errorsWrapper: '<ul class="errorlist"></ul>'
        });
    }


    function installTypeAhead() {



        var catalogs = new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            limit: 5,
            prefetch: {
                url: '/dashboard/questions/catalogue/',
                ttl: 0,
                filter: function (data) {
                    return $.map(data, function (catalog) {
                        return {
                            name: catalog.catalogue_name,
                            scope : catalog.catalogue_scope.toLocaleLowerCase(),
                            value: catalog.id
                        };
                    });
                }
            }
        });

        catalogs.clearPrefetchCache();
        catalogs.initialize();

        $('.create-interview .typeahead').typeahead(
            {
                hint: true,
                highlight: true
            },{
            name: 'catalogs',
            displayKey: 'name',
            source: catalogs.ttAdapter(),
            templates: {
            empty: [
                 '<div class="empty-message">',
                  '<p>Unable to find any catalogue that match your query</p>',
                  '</div>'
                  ].join('\n'),
            suggestion: _.compile([
                            '<div class="suggestion">',
                                '<span class="<%=scope%>"></span>',
                                '<p><%=name%></p>',
                            '</div>'
                        ].join(''))
            }
        }).on("typeahead:selected typeahead:autocompleted", function(e, datum) {
            var fieldName = $(this).data("field-name");
            $("[name=" + fieldName + "]").val(datum.value);
        });
    }

    /***************************************************************
     *                        Public methods                       *
    ****************************************************************/

    window.createInterview = {
        installCreateInterviewModule: installCreateInterviewModule
    };

})(jQuery);