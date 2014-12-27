define(function (require) {

  require("jquery.fileupload-validate");
  require("backbone.boostrap-modal");

  var Utils = require("utils");
  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var Notification = require("notification");

  var Interview = require("modules/interviews/models/Interview");
  var createFormTemplate = require("text!modules/interviews/templates/createForm.html");
  var Calendar = require("modules/interviews/views/InterviewCalendarView");
  var JobPositionCreator = require("modules/interviews/views/CreateJobPosition");


  return Backbone.View.extend({

    template : _.template(createFormTemplate),

    events : {
     'submit #createInterview'  : 'handleFormSubmit',
     'click .open-create-job-position' : 'openCreateJobPosition',
     'click .open-calendar' : 'openCalendar'
    },

    initialize:function(options){
      this.options = options;
      this.interviewCollection = options.interviews;
      this.interviewRouter = options.router;
      this.dirtyInterview = this.model ? $.extend(true, {}, this.model) : undefined;
      //
      this.listenTo(this.interviewCollection, 'error', Utils.syncError);
    },

    getTemplateData : function() {

      /*
        This is piece of shi
       */
      if(!this.model) {
        return {
          create : true,
          title : "New interview",
          interview : null,
          cv : null,
          catalogues : this.options.catalogues.toJSON(),
          jobPositions : this.options.jobPositions.toJSON()
        };
      }

      return {
        create : false,
        title : "Update interview",
        interview : this.model.toJSON(),
        cv : this.model.getCV().toJSON(),
        catalogues : this.options.catalogues.toJSON(),
        jobPositions : this.options.jobPositions.toJSON()
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

    openCreateJobPosition : function (event){

      var jobPositionCreator  = new JobPositionCreator();

      var self = this;

      var modal = new Backbone.BootstrapModal({
          content: jobPositionCreator,
          title : "Create job interview",
          animate: true,
          okCloses:true,
          footer: false
      });

      modal.render().$el
        .find(".modal-dialog")
        .width("40%");

      jobPositionCreator.setModalView(modal);

      this.intsallJobSpecUploader(jobPositionCreator);
      this.installParsely.call(jobPositionCreator);

      modal.open();

      console.log("Open create");
    },

    openCalendar: function() {

      var calendar =  new Calendar({
        collection:window.cache.interviews,
        interview: this.dirtyInterview
      });

      var self = this;

      var modal = new Backbone.BootstrapModal({
          content: calendar,
          animate: true,
          okCloses:true,
          footer: true
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
      this.$el.find(".datetime .start").val(start.format("YYYY-MM-DD HH:mm"));
      this.$el.find(".datetime .end").val(end.format("YYYY-MM-DD HH:mm"));
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
      var self = this;
      this.interviewCollection.create(new_interview, {
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

    intsallJobSpecUploader : function(form){
      this.installFileUploader.call(form, "jobSpec", ".job-spec-uploader");
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
