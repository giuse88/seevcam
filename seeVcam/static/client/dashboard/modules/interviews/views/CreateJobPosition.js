/**
 *
 * Created by giuseppe on 23/12/14.
 */

define(function (require) {

  var $ = require("jquery");
  var _ = require("underscore");
  var Backbone = require("backbone");
  var createFormTemplate = require("text!modules/interviews/templates/createJobPosition.html");
  var JobPosition = require("modules/interviews/models/JobPosition");
  var Overlay = require("misc/overlay/overlay");

 return Backbone.View.extend({
    className : "job-position-create-container",
    template: _.template(createFormTemplate),

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
      overlay.render();
      this.$el.prepend(this.$el);
      window.cache.jobPositions.create(jobPostion,
        {
        success: function (response) {
          overlay.remove();
          self.modal && self.modal.close();
          console.log("Job spec created ");
        },
        error: function (response) {
          overlay.remove();
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

