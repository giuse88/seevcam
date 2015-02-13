define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var createFormTemplate = require("text!modules/interviews/templates/createJobPosition.html");
  var errorFormTemplate = require("text!modules/interviews/templates/error.html");
  var JobPosition = require("models/job_position");
  var Overlay = require("misc/overlay/overlay");

 return Backbone.View.extend({
    className : "job-position-create-container",
    template: _.template(createFormTemplate),
    error_template: _.template(errorFormTemplate),

    events :  {
      'submit #createJobSpec'  : 'handleFormSubmit'
    },

    initialize : function(options) {
     this.options = options;
    },

    render: function() {
      this.$el.html(this.template);
      this.$form = this.$el.find("form");
      return this;
    },

     setModalView :function (modal) {
      this.modal = modal;
     },

    handleFormSubmit : function(event) {
      event.preventDefault();
      var jobPostion = new JobPosition(this.serializer());
      var self = this;
      console.log(jobPostion.get("position"));
      console.log(jobPostion.toJSON());
      var overlay = new Overlay();
      this.$el.prepend(overlay.render().$el);
      window.cache.jobPositions.create(jobPostion,
        {
        success: function (savedJobPosition) {
          overlay.remove();
          self.modal && self.modal.close();
          /* TODO find a better solution */
          $('.select-job-position')
           .append($("<option></option>")
           .attr("value",savedJobPosition.get('id'))
           .text(savedJobPosition.get('position')))
           .val(savedJobPosition.get('id'));
          /**********************************/
          console.log("Job spec created ");
        },
        error: function (response) {
          //render error messag
          overlay.remove();
          this.$form
            .children()
            .first()
            .prepend(this.error_template(response.job_description[0]));
          console.error("FAILED : job Spec", response);
          Notification.warning("Update failed", "Reloading the page should fix the issue");
        }
      });
    },

   serializer: function(){
     var jobSpec = {};
     this.$form.serializeArray().map(function(item) {
       jobSpec[item.name] = item.value;
     });
     jobSpec.job_description = Number(jobSpec.job_description);
     return jobSpec;
   }
  });

});

