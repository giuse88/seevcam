define(function (require) {

  var $ = require("jquery");
  require("typeahead");
  require("parsley");
  require("jquery-fileupload");

  (function (_) {
    'use strict';
    _.compile = function (templ) {
        var compiled = this.template(templ);
        compiled.render = function (ctx) {
            return this(ctx);
        }
        return compiled;
    }
})(window._);


    /***************************************************************
     *                        Constructor                           *
     ****************************************************************/

    function installCreateInterviewModule(){
        console.log(" -- Create interview beginning constructor --  ");
//        installParsley();
        installTypeAhead();
        installToolTip();
        installSubmit();

      // FIle upload TODO refactor
       var oldFile = null;
        function delete_url(url) {
          $.ajax({
              url: url,
              type: 'DELETE',
              success: function(result) {
                  // Do something with the result
              }
          });
        };

        $('.cv-uploader .fileupload').fileupload({
          dataType: 'json',
          maxNumberOfFiles : 1,
          formData: {type: 'cv'},
          done: function (e, data) {
              oldFile && delete_url(oldFile.delete_url);
              $.each(data.result.files, function (index, file) {
                  oldFile = file;
                  $('.name').html("<a target='_blank'  href='"+file.url +"'>" + file.original_name+"</a>");
              });
          }
    });

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

    function installSubmit() {
      $('.create-interview-form').on('submit', function (event) {
        $.pjax.submit(event, '#container', {
          pjax_end : function (){
            console.log("hello");
            installCreateInterviewModule();
          }});
        console.log("form submited");
      });
    }


    function installTypeAhead() {

        /*
          remove this cache
          the router should download this info
         */
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

    return {
        installCreateInterview: installCreateInterviewModule
    };

});