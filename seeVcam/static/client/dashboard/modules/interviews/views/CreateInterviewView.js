define(function (require) {

  require("jquery.fileupload-validate");
  require("backbone.boostrap-modal");

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");

  var Interview = require("modules/interviews/models/Interview");
  var createFormTemplate = require("text!modules/interviews/templates/createForm.html");
  var Calendar = require("modules/interviews/views/InterviewCalendarView");

  var ModalView = Backbone.View.extend({
    tagName: 'p',
    template: 'this is modal content',
    render: function() {
        this.$el.html(this.template);
        console.log('modal rendered');
        return this;
    }
});

  return Backbone.View.extend({

    template : _.template(createFormTemplate),

    events : {
     'submit #createInterview'  : 'handleFormSubmit',
     'click .open-calendar' : 'openCalendar'
    },

    initialize:function(options){
      this.options = options;
      this.interviewCollection = options.interviews;
      this.interviewRouter = options.router;
      this.dirtyInterview = $.extend(true, {}, this.model);
    },

    getTemplateData : function() {

      if(!this.model) {
        return {
          create : true,
          title : "New interview",
          interview : null,
          cv : null,
          catalogues : this.options.catalogues,
          jobPositions : this.options.jobPositions
        };
      }

      return {
        create : false,
        title : "Update interview",
        interview : this.model.toJSON(),
        cv : this.model.getCV().toJSON(),
        catalogues : this.options.catalogues,
        jobPositions : this.options.jobPositions
      }

    },

    render: function (){
      this.$el.html(this.template(this.getTemplateData()));
      this.$form = this.$el.find("form");
      this.installParsely();
      this.installCVUploader();
      this.installTypeAhead();
      return this;
    },

    openCalendar: function() {

      var calendar =  new Calendar({
        collection:window.cache.interviews,
        interview: this.dirtyInterview
      });

      var self = this;

      var modal = new Backbone.BootstrapModal({
          content: calendar,
          animate: true
      });

      modal.render().$el.find(".modal-dialog").width("60%");

      modal.open(function(){
        var start = calendar.start();
        var end = calendar.end();
        self.updateDateTimeForm(start, end);
      });

      setTimeout(function() {
        calendar.render();
      } ,200);
    },

    updateDateTimeForm : function (start, end) {
      this.$el.find(".datetime .start").val(start.format());
      this.$el.find(".datetime .end").val(end.format());
      this.displayTime(start, end);
    },

    displayTime : function(start, end){
      this.$el.find('.datetime-display p').html(start.toString());
    },


    installParsely : function(){
      this.$form.parsley({
        errorClass: 'has-error',
        classHandler: function (el) {
          return el.$element.closest('.form-group');
        },
        errorsWrapper: '<ul class="errorlist"></ul>'
      });
      return this;
    },

    handleFormSubmit: function (event) {
      console.log("submit");
      event.preventDefault();
      var interview  = this.serializeForm();
      console.log(interview);
      if (!this.model) {
        this.createInterview(interview);
      }else {
        this.updateInterview(interview);
      }
    },

    updateInterview : function(interview) {
      var self = this;
      this.model.save(interview, {
        success: function (response) {
          console.log("SUCCESS : interview updated.");
          self.interviewRouter.goToInterviews(true);
        },
        error: function (response) {
          console.error("FAILED : interview  not updated");
          console.error(response);
          Notification.warning("Update failed", "Reloading the page should fix the issue");
        }
      });
    },

    createInterview:function (new_interview) {
      var baseInterview = {
        "job_position": 2,
        "catalogue": 1
        };
      var interview = _.extend(baseInterview, new_interview);
      this.interviewCollection.create(interview, {wait:true});
      this.interviewRouter.goToInterviews(true);
      console.log(interview);

    },

    serializeForm : function( ){
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
      return interview;
    },

    installCVUploader: function() {
      this.installFileUploader("cv", ".cv-uploader");
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
        maxFileSize : 3000000,
        maxNumberOfFiles : 1,
        acceptFileTypes: /(\.|\/)(docx|doc|pdf)$/i,
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
          $(containerClass +" .fileupload-container .errorlist ").empty();
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
      })
      .on('fileuploadprocessalways', function (e, data) {
        var file = data.files[0],
          node = $(containerClass +" .fileupload-container > .errorlist ");
        if (file.error) {
          node.html($('<li class="file-error"/>').text(file.error));
        }
      });
      return this;
    },

    installTypeAhead: function() {
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

       this.$el.find('.typeahead').typeahead(
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
  });
});
