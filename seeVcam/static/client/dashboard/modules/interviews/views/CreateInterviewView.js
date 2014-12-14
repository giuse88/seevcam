define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  require("backbone-forms");

  var Interview = require("modules/interviews/models/Interview");
  var createFormTemplate = require("text!modules/interviews/templates/createForm.html");

  return Backbone.View.extend({

    template : _.template(createFormTemplate),

    events : {
     'submit #createInterview'  : 'handleFormSubmit'
    },

    render: function (){
      this.$el.html(this.template());
      this.$form = this.$el.find("form");
      this.installParsely();
      this.installCVUploader();
      return this;
    },

    installTypeAhead: function(){

    },

    installParsely : function(){
      this.$el.find("form").parsley({
        errorClass: 'has-error',
        classHandler: function (el) {
          return el.$element.closest('.form-group');
        },
        errorsWrapper: '<ul class="errorlist"></ul>'
      });
      return this;
    },

    handleFormSubmit: function (event) {
      event.preventDefault();
      var interview = {
        candidate : {}
      };
      this.$form.serializeArray().map(function(item) {
        if (item.name.indexOf("candidate") > -1 ) {
          var name = item.name.substring(item.name.indexOf("_")+1);
          interview.candidate[name] = item.value;
        }else {
          interview[item.name] = item.value;
        }
      });
      console.log(interview);
      console.log(event);
    },

    installCVUploader: function() {
      this.installFileUploader("cv", ".cv-uploader");
      console.log("installFileUploader");
      return this;
    },

    installFileUploader: function (type, containerClass) {

      var self = this;

      function deleteOldFileIfAny() {

        var deleteUrl = self.$el.find(containerClass + " .uploaded-file-link a").data("delete-url");
        var fileName = self.$el.find(containerClass + " .uploaded-file-link a").html();

        deleteUrl && $.ajax({
            url: deleteUrl,
            type: 'DELETE',
            success: function(result) {console.log("File : " + fileName + "deleted.")}
        });
      }

      this.$el.find(containerClass + ' .fileupload').fileupload({
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
              // upload input form
              self.$el.find(containerClass + ' .file-id-input').val(file.id);
              // upload link
              self.$el.find(containerClass + ' .uploaded-file-link')
                .html("<a target='_blank' data-delete-url="+file.delete_url
                      +" href='"+file.url +"'>" + file.original_name+"</a>");
            });
            setTimeout(function(){
              self.$el.find(containerClass + ' .progress').hide();
              self.$el.find(containerClass + ' .progress .progress-bar').css( 'width', 0);
            }, 1000);
        }
      });
      return this;
    }

  });
});
