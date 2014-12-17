define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");

  require("typeahead");
  require("parsley");


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
        installJobSpecUploader();
        installCVuploader();
     console.log(" -- Create interview end constructor --  ");
    }

    /****************************************************************
     *                        Private methods                       *
     ****************************************************************/

    function installFileUploader(type, containerClass) {
      function deleteOldFileIfAny() {
        var deleteUrl = $(containerClass + " .uploaded-file-link a").data("delete-url");
        var fileName = $(containerClass + " .uploaded-file-link a").html();
        deleteUrl && $.ajax({
            url: deleteUrl,
            type: 'DELETE',
            success: function(result) {console.log("File : " + fileName + "deleted.")}
        });
      }

        $(containerClass + ' .fileupload').fileupload({
          dataType: 'json',
          maxNumberOfFiles : 1,
          formData: {type: type},
          progressall: function (e, data) {
             $(containerClass + ' .progress').show();
             var progress = parseInt(data.loaded / data.total * 100, 10);
             setTimeout(function() {
               $(containerClass + ' .progress .progress-bar').css('width', progress + '%');
              }, 500);
          },
          done: function (e, data) {
              deleteOldFileIfAny();
              $.each(data.result.files, function (index, file) {
                  $(containerClass + ' .file-id-input').val(file.id);
                  $(containerClass + ' .uploaded-file-link')
                    .html("<a target='_blank' data-delete-url="+file.delete_url
                          +" href='"+file.url +"'>" + file.original_name+"</a>");
              });

              setTimeout(function(){
                $(containerClass + ' .progress').hide();
                $(containerClass + ' .progress .progress-bar').css( 'width', 0);
              }, 1000);
          }
      });
    }

    function installCVuploader() {
      installFileUploader("cv", ".cv-uploader");
    }

    function installJobSpecUploader() {
      installFileUploader("job-spec", ".job-description-uploader");
    }

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